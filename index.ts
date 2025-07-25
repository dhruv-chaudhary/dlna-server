import { startSSDPBroadcast } from "./lib/dlna/broadcast";
import { getBrowseResponseXml, getCdsXml, getDescriptionXml } from "./lib/dlna/xml-templates";
import { HTTP_PORT, MEDIA_DIR, SERVER_NAME } from "./lib/dlna/config";
import fs from "fs-extra";
import mime from "mime";
import { hasText } from "./lib/utils/common";

// Start SSDP broadcast
startSSDPBroadcast();

function sendXml(xml: string) {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

const server = Bun.serve({
  port: HTTP_PORT,
  routes: {
    "/description.xml": {
      GET: () => {
        return sendXml(getDescriptionXml());
      },
    },
    "/cds.xml": {
      GET: () => {
        return sendXml(getCdsXml());
      },
    },
    "/cds-control": {
      POST: async (req) => {
        const body = await req.text();
        console.log("--- Incoming /cds-control request ---");
        console.log(body);
        if (body.includes("Browse")) {
          // TODO: Discover files in MEDIA_DIR instead of hardcoding sample.mp4
          const resultXML = getBrowseResponseXml("sample.mp4");
          console.log("--- Sending BrowseResponse ---");
          console.log(resultXML);
          return new Response(resultXML, {
            headers: {
              "Content-Type": 'text/xml; charset="utf-8"',
              EXT: "",
              Server: SERVER_NAME,
              Connection: "close",
            },
          });
        }

        return new Response("Invalid request", { status: 400 });
      },
    },
    "/media/:filename": {
      HEAD: (req) => {
        const { filename } = req.params;
        const filepath = `${MEDIA_DIR}/${filename}`;
        if (!filepath || !fs.pathExistsSync(filepath)) {
          return Response.json({ error: "File not found" }, { status: 404 });
        }
        return new Response(null, {
          headers: {
            "Content-Type": mime.getType(filepath) ?? "application/octet-stream",
            "Accept-Ranges": "bytes",
            "Content-Length": String(fs.statSync(filepath).size),
          },
        });
      },
      GET: (req) => {
        const { filename } = req.params;
        const filepath = `${MEDIA_DIR}/${filename}`;
        if (!filepath || !fs.pathExistsSync(filepath)) {
          return Response.json({ error: "File not found" }, { status: 404 });
        }

        const rangeHeader = req.headers.get("Range");
        if (!hasText(rangeHeader)) {
          return new Response(Bun.file(filepath));
        }

        const range = rangeHeader.split("=").at(-1);
        if (!hasText(range)) {
          // Bad Request
          return new Response(null, { status: 400 });
        }

        const bigFile = Bun.file(filepath);

        const [startStr, endStr]: string[] = range.split("-"); // ["0", "100"]

        let start = hasText(startStr) ? Number(startStr) : null;
        let end = hasText(endStr) ? Number(endStr) : null;

        if (start === null && end === null) {
          return new Response(null, { status: 400 });
        }

        if (start !== null && end === null) {
          end = bigFile.size - 1;
        }

        if (start === null && end !== null) {
          start = bigFile.size - end;
          end = bigFile.size - 1;
        }

        if (start === null || end === null) {
          return new Response("Unable to determine start or end", { status: 500 });
        }

        if (start < 0 || end < 0 || start > end || end >= bigFile.size) {
          return new Response(null, { status: 416 }); // Range Not Satisfiable
        }
        return new Response(bigFile.slice(start, end + 1), {
          headers: {
            "Content-Type": mime.getType(filepath) ?? "application/octet-stream",
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${bigFile.size}`,
            "Content-Length": String(end - start + 1),
          },
        });
      },
    },
    "/*": {
      OPTIONS: () => {
        const response = new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, SOAPAction",
          },
        });
        return response;
      },
    },
  },
});

console.log(`Server is running on http://localhost:${server.port}`);
