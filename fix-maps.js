const fs = require('fs');

// App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace("import Map, { Marker } from 'react-map-gl/maplibre';", "import Map, { Marker } from 'react-map-gl';");
appContent = appContent.replace("import 'maplibre-gl/dist/maplibre-gl.css';", "import 'mapbox-gl/dist/mapbox-gl.css';");
appContent = appContent.replace(
  'mapStyle={"version":8,"sources":{"satellite":{"type":"raster","tiles":["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],"tileSize":256}},"layers":[{"id":"satellite","type":"raster","source":"satellite","minzoom":0,"maxzoom":22}]}}',
  'mapStyle="mapbox://styles/mapbox/satellite-v9"\n                      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}'
);
fs.writeFileSync('src/App.tsx', appContent);

// ClientsPlantsModule.tsx
let clientsContent = fs.readFileSync('src/components/ClientsPlantsModule.tsx', 'utf8');
clientsContent = clientsContent.replace("import Map, { Marker, Popup } from 'react-map-gl/maplibre';", "import Map, { Marker, Popup } from 'react-map-gl';");
clientsContent = clientsContent.replace("import 'maplibre-gl/dist/maplibre-gl.css';", "import 'mapbox-gl/dist/mapbox-gl.css';");
clientsContent = clientsContent.replace(
  'mapStyle={"version":8,"sources":{"carto":{"type":"raster","tiles":["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],"tileSize":256}},"layers":[{"id":"carto","type":"raster","source":"carto","minzoom":0,"maxzoom":22}]}}',
  'mapStyle="mapbox://styles/mapbox/streets-v12"\n                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}'
);
fs.writeFileSync('src/components/ClientsPlantsModule.tsx', clientsContent);
