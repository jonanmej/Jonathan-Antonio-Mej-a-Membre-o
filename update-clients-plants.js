const fs = require('fs');
let content = fs.readFileSync('src/components/ClientsPlantsModule.tsx', 'utf8');

// Replace the interface and mock data with an import
content = content.replace(/type PlantStatus[\s\S]*?coords: \{ lat: 13\.4357, lng: -87\.4111 \}\n    \},\n    \{\n      id: 'SOL-088',\n      name: 'Planta Nacaome 2',\n      client: 'Energía del Sur',\n      type: 'Fotovoltaica',\n      capacity: '20 MW',\n      contractExp: 'En Revisión \(Vencido\)',\n      status: 'alerta',\n      coords: \{ lat: 13\.5133, lng: -87\.4914 \}\n    \}\n  \];/g, "import { plants, Plant } from '../data';");

fs.writeFileSync('src/components/ClientsPlantsModule.tsx', content);
