import path from "path";
import { getLocalIP } from "../utils/common";

export const SSDP_ADDRESS = "239.255.255.250";
export const SSDP_PORT = 1900;
export const HTTP_PORT = process.env.HTTP_PORT ?? 3000;
export const DLNA_DEVICE_TYPE = "urn:schemas-upnp-org:device:MediaServer:1";
export const SERVER_NAME = process.env.SERVER_NAME ?? "Generic DLNA Server";
export const MANUFACTURER = "Dhruv Chaudhary";
export const MANUFACTURER_URL = "https://dhruvchaudhary.com";
export const SERVER_DESCRIPTION = process.env.SERVER_DESCRIPTION ?? SERVER_NAME;
export const SERVER_URL = `http://${getLocalIP()}:${HTTP_PORT}`;
export const MEDIA_DIR = process.env.MEDIA_DIR ?? path.join(process.cwd(), "media");
