import dgram from "dgram";
import { SSDP_ADDRESS, SSDP_PORT, DLNA_DEVICE_TYPE, SERVER_NAME, SERVER_URL } from "./config";
import { getLocalIP } from "../utils/common";
import { getOrCreateUUID } from "./utils";

export async function startSSDPBroadcast() {
  const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });

  socket.on("listening", () => {
    socket.addMembership(SSDP_ADDRESS);
    console.log("SSDP listener started");
    sendNotify(); // initial notify
    setInterval(sendNotify, 30000); // repeat every 30 seconds (standard interval)
  });

  socket.on("message", (msg, rinfo) => {
    console.log("Received SSDP message:", msg.toString());
    const message = msg.toString();
    if (message.includes("M-SEARCH") && message.includes("ssdp:discover")) {
      if (
        message.includes("urn:schemas-upnp-org:device:MediaServer:1") ||
        message.includes("ssdp:all") ||
        message.includes("upnp:rootdevice")
      ) {
        respondToSearch(rinfo.address, rinfo.port);
      }
    }
  });

  function sendNotify() {
    const localIP = getLocalIP();
    const notifyMessage = [
      "NOTIFY * HTTP/1.1",
      `HOST: ${SSDP_ADDRESS}:${SSDP_PORT}`,
      "NT: upnp:rootdevice",
      "NTS: ssdp:alive",
      `USN: ${getOrCreateUUID()}::upnp:rootdevice`,
      `SERVER: ${SERVER_NAME}`,
      "CACHE-CONTROL: max-age=1800",
      `LOCATION: ${SERVER_URL}/description.xml`,
      "",
      "",
    ].join("\r\n");

    socket.send(notifyMessage, SSDP_PORT, SSDP_ADDRESS);
    console.log("Sent SSDP NOTIFY");

    // Also send device-specific NOTIFY
    const deviceNotifyMessage = [
      "NOTIFY * HTTP/1.1",
      `HOST: ${SSDP_ADDRESS}:${SSDP_PORT}`,
      `NT: ${DLNA_DEVICE_TYPE}`,
      "NTS: ssdp:alive",
      `USN: ${getOrCreateUUID()}::${DLNA_DEVICE_TYPE}`,
      `SERVER: ${SERVER_NAME}`,
      "CACHE-CONTROL: max-age=1800",
      `LOCATION: http://${localIP}:3000/description.xml`,
      "",
      "",
    ].join("\r\n");

    socket.send(deviceNotifyMessage, SSDP_PORT, SSDP_ADDRESS);
    console.log("Sent device-specific SSDP NOTIFY");
  }

  function respondToSearch(address: string, port: number) {
    const localIP = getLocalIP();
    const response = [
      "HTTP/1.1 200 OK",
      `CACHE-CONTROL: max-age=1800`,
      `DATE: ${new Date().toUTCString()}`,
      `EXT:`,
      `LOCATION: http://${localIP}:3000/description.xml`,
      `SERVER: ${SERVER_NAME}`,
      `ST: ${DLNA_DEVICE_TYPE}`,
      `USN: ${getOrCreateUUID()}::${DLNA_DEVICE_TYPE}`,
      "",
      "",
    ].join("\r\n");

    socket.send(response, port, address);
    console.log(`Sent SSDP response to ${address}:${port}`);
  }

  socket.bind(SSDP_PORT);
}
