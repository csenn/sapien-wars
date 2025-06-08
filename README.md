# Sapien Wars

Static visualization of historical wars using React and Mapbox.
The project now uses [Vite](https://vitejs.dev) for development and builds.

## Development

```bash
npm install
npm run dev
```

## Build

Create the parsed data and generate the production bundle using Vite:

```bash
MAPBOX_TOKEN=your_token npm run build
```

The static files are emitted to the `build` directory and can be served with any static web server.
