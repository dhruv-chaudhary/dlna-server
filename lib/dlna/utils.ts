import fs from "fs-extra";
import path from "path";
import crypto from "crypto";

export function getOrCreateUUID(): string {
  const file = path.join(process.cwd(), "server.uuid");
  if (fs.pathExistsSync(file)) {
    return fs.readFileSync(file, "utf8").trim();
  }

  const uuid = "uuid:" + crypto.randomUUID();
  fs.writeFileSync(file, uuid);
  return uuid;
}
