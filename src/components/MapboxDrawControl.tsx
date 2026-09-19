import { useControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { ControlPosition } from 'react-map-gl';
import localforage from 'localforage';
import { useRef, useEffect } from 'react';

const blue = '#3bb2d0';
const orange = '#fbb03b';
const white = '#fff';

const theme = [
  {
    'id': 'gl-draw-polygon-fill',
    'type': 'fill',
    'filter': ['all', ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': ['case', ['==', ['get', 'active'], 'true'], orange, blue],
      'fill-opacity': 0.18,
    },
  },
  {
    'id': 'gl-draw-lines',
    'type': 'line',
    'filter': ['any', ['==', '$type', 'LineString'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round',
    },
    'paint': {
      'line-color': ['case', ['==', ['get', 'active'], 'true'], orange, blue],
      'line-width': 2.5,
    },
  },
  {
    'id': 'gl-draw-point-outer',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    'paint': {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': white,
    },
  },
  {
    'id': 'gl-draw-point-inner',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'feature']],
    'paint': {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': ['case', ['==', ['get', 'active'], 'true'], orange, blue],
    },
  },
  {
    'id': 'gl-draw-vertex-outer',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'simple_select']],
    'paint': {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 7, 5],
      'circle-color': white,
    },
  },
  {
    'id': 'gl-draw-vertex-inner',
    'type': 'circle',
    'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'vertex'], ['!=', 'mode', 'simple_select']],
    'paint': {
      'circle-radius': ['case', ['==', ['get', 'active'], 'true'], 5, 3],
      'circle-color': orange,
    },
  },
  {
    'id': 'gl-draw-midpoint',
    'type': 'circle',
    'filter': ['all', ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': orange,
    },
  },
];

export type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  storageKey?: string;
  initialData?: any;
  onCreate?: (evt: { features: object[] }) => void;
  onUpdate?: (evt: { features: object[]; action: string }) => void;
  onDelete?: (evt: { features: object[] }) => void;
  onChange?: (featuresGeoJson: any) => void;
  onDrawReady?: (draw: any) => void;
};

export default function DrawControl(props: DrawControlProps) {
  const drawInstanceRef = useRef<any>(null);
  const isRestoredRef = useRef(false);

  useControl<any>(
    () => {
      const drawInstance = new MapboxDraw({
        ...props,
        styles: props.styles || theme,
      });
      drawInstanceRef.current = drawInstance;
      if (props.onDrawReady) {
        props.onDrawReady(drawInstance);
      }
      return drawInstance;
    },
    ({ map }) => {
      const persistFeatures = async () => {
        const instance = drawInstanceRef.current;
        if (!instance) return;
        try {
          const allData = instance.getAll();
          if (props.storageKey) {
            await localforage.setItem(props.storageKey, allData);
          }
          if (props.onChange) {
            props.onChange(allData);
          }
        } catch (err) {
          console.error('Error saving drawn polygons to localforage:', err);
        }
      };

      const handleCreate = (evt: any) => {
        persistFeatures();
        if (props.onCreate) props.onCreate(evt);
      };

      const handleUpdate = (evt: any) => {
        persistFeatures();
        if (props.onUpdate) props.onUpdate(evt);
      };

      const handleDelete = (evt: any) => {
        persistFeatures();
        if (props.onDelete) props.onDelete(evt);
      };

      map.on('draw.create', handleCreate);
      map.on('draw.update', handleUpdate);
      map.on('draw.delete', handleDelete);

      const restoreFeatures = async () => {
        const instance = drawInstanceRef.current;
        if (!instance) return;
        try {
          let dataToLoad = props.initialData;
          if (props.storageKey) {
            const saved: any = await localforage.getItem(props.storageKey);
            if (saved && (Array.isArray(saved.features) ? saved.features.length > 0 : saved.length > 0)) {
              dataToLoad = saved;
            }
          }
          if (dataToLoad && instance) {
            instance.deleteAll();
            if (typeof instance.set === 'function') {
              instance.set(dataToLoad);
            } else if (typeof instance.add === 'function') {
              instance.add(dataToLoad);
            }
            isRestoredRef.current = true;
            if (props.onChange) {
              props.onChange(dataToLoad);
            }
          }
        } catch (err) {
          console.error('Error restoring polygons from localforage:', err);
        }
      };

      if (map.isStyleLoaded()) {
        restoreFeatures();
      } else {
        map.once('style.load', restoreFeatures);
        map.once('load', restoreFeatures);
        setTimeout(restoreFeatures, 350);
      }
    },
    ({ map }) => {
      if (props.onCreate) map.off('draw.create', props.onCreate);
      if (props.onUpdate) map.off('draw.update', props.onUpdate);
      if (props.onDelete) map.off('draw.delete', props.onDelete);
      drawInstanceRef.current = null;
      isRestoredRef.current = false;
    },
    {
      position: props.position
    }
  );

  useEffect(() => {
    if (props.initialData && drawInstanceRef.current && !isRestoredRef.current) {
      try {
        drawInstanceRef.current.deleteAll();
        if (typeof drawInstanceRef.current.set === 'function') {
          drawInstanceRef.current.set(props.initialData);
        } else if (typeof drawInstanceRef.current.add === 'function') {
          drawInstanceRef.current.add(props.initialData);
        }
        isRestoredRef.current = true;
      } catch (e) {
        console.error('Error applying initialData to draw:', e);
      }
    }
  }, [props.initialData]);

  return null;
}
