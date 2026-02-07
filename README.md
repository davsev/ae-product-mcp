# AliExpress Product Scraper

A tool to scrape product information from AliExpress, including title, description, and main image.

## Features

- Extracts product title, description, and main image
- Multiple extraction methods (JSON-LD, embedded state, meta tags)
- HTTP server for easy API access
- MCP (Model Context Protocol) server support

## Installation

```bash
npm install
```

## Usage

### As HTTP Server

```bash
npm start
```

Then make POST requests to `/fetch`:

```bash
curl -X POST http://localhost:3000/fetch \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.aliexpress.com/item/..."}'
```

### As MCP Server

Run with:

```bash
node src/index.js
```

## Project Structure

```
aliexpress-mcp/
├── src/
│   ├── scraper.js        # Core scraping logic
│   ├── http-server.js    # Express HTTP server
│   └── index.js          # MCP server
├── package.json
└── package-lock.json
```

## License

ISC
