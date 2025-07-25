# DLNA Server

A blazing fast DLNA media server built with Bun and TypeScript — stream your local videos to any device on your network.

## Features

- **Automatic Media Discovery**: Automatically scans and discovers video files in the media directory
- **SSDP Discovery**: Broadcasts server presence on the local network with proper SSDP protocol implementation
- **Media Streaming**: Stream video files to DLNA clients with full range request support
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

3. The server will:

   - Start on `http://<your-ip>:3000`
   - Automatically scan the media directory for video files
   - Begin broadcasting its presence on the network via SSDP
   - Respond to discovery requests from DLNA clients

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

The server currently supports:

- **Video files**: MP4 (video/mp4)

File type detection is handled automatically using MIME types.

## API Endpoints

- `/description.xml` - DLNA device description (UPnP device info)
- `/cds.xml` - Content Directory Service description
- `/cds-control` - Content Directory Service control point
- `/media/:filename` - Media file streaming with range request support

## How It Works

1. **Media Scanning**: On startup, the server scans the configured media directory for supported video files
2. **Network Discovery**: The server broadcasts its presence using SSDP (Simple Service Discovery Protocol) on the local network
3. **Device Description**: DLNA clients can discover the server and retrieve device information via `/description.xml`
4. **Content Browsing**: Clients can browse available media files through the Content Directory Service (`/cds-control`)
5. **Media Streaming**: Files are streamed with full range request support, enabling seeking and partial content delivery

### SSDP Implementation

The server implements a complete SSDP stack:

- Sends periodic NOTIFY messages to announce presence
- Responds to M-SEARCH discovery requests
- Maintains proper SSDP message formatting and timing
- Uses persistent UUID for consistent device identification

## Troubleshooting

- **Server not visible on network**:
  - Ensure your firewall allows connections on port 3000 (or your configured port)
  - Check that SSDP traffic (UDP port 1900) is not blocked
- **Media files not showing**:
  - Check that files are placed in the correct media directory
  - Verify files are in supported formats (currently MP4)
  - Check server logs for scanning errors
- **Streaming issues**:
  - Verify that your media files are in supported formats
  - Check that range requests are working properly

## Roadmap

- **Extended Media Support**: Add support for additional video formats (AVI, MKV, MOV, etc.)
- **Audio Support**: Add support for audio file streaming
- **Image Support**: Add support for image file browsing
- **Metadata Extraction**: Extract and display media metadata
- **Web Interface**: Add a simple web interface for server management

## Contributing

Pull requests are welcome! If you have suggestions, ideas, or fixes, feel free to open an issue or submit a PR.

## Development

This project was created using `bun init` in bun v1.2.18. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
