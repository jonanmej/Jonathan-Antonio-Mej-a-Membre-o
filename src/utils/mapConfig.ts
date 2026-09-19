import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Token de Mapbox configurado en las variables de entorno
export const MAPBOX_TOKEN: string = (import.meta.env.VITE_MAPBOX_TOKEN as string || '').trim();

export const isMapboxConfigured: boolean = Boolean(
  MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.')
);

// Si existe el token válido de Mapbox, configurarlo globalmente en mapboxgl
if (isMapboxConfigured && typeof window !== 'undefined') {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// Biblioteca de mapas activa
export const activeMapLib = (isMapboxConfigured ? mapboxgl : maplibregl) as any;
const maplibreglAny = maplibregl as any;
export { mapboxgl, maplibreglAny as maplibregl };

// Estilos de mapas:
// Configurado exclusivamente con vista satelital (con etiquetas de calles/híbrido) conforme al requerimiento del usuario.
const satelliteStyle = isMapboxConfigured
  ? 'mapbox://styles/mapbox/satellite-streets-v12'
  : {
      version: 8 as const,
      sources: {
        'satellite-tiles': {
          type: 'raster' as const,
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
      },
      layers: [
        {
          id: 'satellite-tiles',
          type: 'raster' as const,
          source: 'satellite-tiles',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };

export const MAP_STYLES = {
  streets: satelliteStyle, // Los mapas solo arrojan vista satelital
  satellite: satelliteStyle
};

