import fs from "fs-extra";
import path from "path";
import mime from "mime";

const SUPPORTED_MIME_TYPES = ["video/mp4"];

export function scanMedia(mediaDir: string) {
  const files = fs
    .readdirSync(mediaDir, { withFileTypes: true, recursive: true })
    .filter((dirent) => dirent.isFile() && SUPPORTED_MIME_TYPES.includes(mime.getType(dirent.name) ?? ""))
    .map((file) => path.relative(mediaDir, path.join(file.parentPath, file.name)));
  return files;
}
