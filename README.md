# DLNA Server

A blazing fast DLNA media server built with Bun and TypeScript — stream your local videos to any device on your network.

## Features

- **SSDP Discovery**: Automatically broadcasts server presence on the local network
- **Media Streaming**: Stream video files to DLNA clients
- **Range Requests**: Supports HTTP range requests for seeking in media files
- **Cross-Platform**: Built with Bun runtime for fast performance
- **TypeScript**: Full TypeScript support with type safety
- **Configurable**: Environment variables for customization

## Prerequisites

- [Bun](https://bun.sh) runtime (v1.2.18 or later)
- Media files to stream

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dlna-server
```

2. Install dependencies:

```bash
bun install
```

## Usage

### Quick Start

1. Drop your `.mp4` files into the `media/` folder (or set `MEDIA_DIR`)

2. Start the server:

```bash
bun run index.ts
```

3. The server will start on `http://<your-ip>:3000` (auto-broadcasts over DLNA) and begin broadcasting its presence on the network

4. Look for the server on your DLNA-compatible devices (smart TVs, media players, etc.)

### Development Mode

For development with auto-restart on file changes:

```bash
bun run dev
```

## Configuration

The server can be configured using environment variables:

| Variable             | Default                 | Description                      |
| -------------------- | ----------------------- | -------------------------------- |
| `HTTP_PORT`          | `3000`                  | Port for the HTTP server         |
| `SERVER_NAME`        | `"Generic DLNA Server"` | Name displayed to DLNA clients   |
| `SERVER_DESCRIPTION` | Same as SERVER_NAME     | Server description               |
| `MEDIA_DIR`          | `./media`               | Directory containing media files |

Example:

```bash
HTTP_PORT=8080 SERVER_NAME="My Media Server" bun run index.ts
```

## Supported Media Types

The server supports streaming of various media file types including:

- Video files (MP4)

File type detection is handled automatically using MIME types.

## API Endpoints

- `/description.xml` - DLNA device description
- `/cds.xml` - Content Directory Service description
- `/cds-control` - Content Directory Service control point
- `/media/:filename` - Media file streaming with range request support

## How It Works

1. **Network Discovery**: The server broadcasts its presence using SSDP (Simple Service Discovery Protocol) on the local network
2. **Device Description**: DLNA clients can discover the server and retrieve device information
3. **Content Browsing**: Clients can browse available media files through the Content Directory Service
4. **Media Streaming**: Files are streamed with support for range requests, enabling seeking and partial content delivery

## Troubleshooting

- **Server not visible on network**: Ensure your firewall allows connections on port 3000 (or your configured port)
- **Media files not showing**: Check that files are placed in the correct media directory
- **Streaming issues**: Verify that your media files are in supported formats

## Roadmap

- **Media Discovery**: Add support for scanning the media folder to discover video files automatically
- **Support more video formats**: Add support for additional video formats beyond MP4 (AVI, MKV, MOV, etc.)

## Contributing

Pull requests are welcome! If you have suggestions, ideas, or fixes, feel free to open an issue or submit a PR.

## Development

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
