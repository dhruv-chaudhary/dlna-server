import os from "os";

export function getLocalIP(): string {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    if (!iface) continue;
    for (const i of iface) {
      if (i.family === "IPv4" && !i.internal) {
        return i.address;
      }
    }
  }
  return "127.0.0.1";
}

export function hasText(text: any): text is string {
  return text !== null && text !== undefined && typeof text === "string" && text.trim().length > 0;
}
