const fs = require('fs');

let content = fs.readFileSync('src/components/ClientsPlantsModule.tsx', 'utf8');

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useRef } from 'react';\nimport type { MapRef } from 'react-map-gl';");
content = content.replace('const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);', 'const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);\n  const [popupInfo, setPopupInfo] = useState<Plant | null>(null);\n  const mapRef = useRef<MapRef>(null);');

// Now let's change mapStyle from streets-v12 to satellite-v9
content = content.replace('mapStyle="mapbox://styles/mapbox/streets-v12"', 'mapStyle="mapbox://styles/mapbox/satellite-v9"');

// We need to add the ref to Map
content = content.replace(
  '<Map style={{width: \'100%\', height: \'100%\', position: \'absolute\'}} initialViewState={{',
  '<Map\n                ref={mapRef}\n                style={{width: \'100%\', height: \'100%\', position: \'absolute\'}} \n                initialViewState={{'
);

fs.writeFileSync('src/components/ClientsPlantsModule.tsx', content);
