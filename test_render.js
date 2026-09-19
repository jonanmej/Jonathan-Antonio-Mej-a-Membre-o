import React from 'react';
import { renderToString } from 'react-dom/server';
import { PieChart, Pie, Cell } from 'recharts';

try {
  const chart = React.createElement(PieChart, { width: 400, height: 400 }, 
    React.createElement(Pie, { data: [{name: 'A', value: 10}], dataKey: 'value', cx: '50%', cy: '50%', outerRadius: 50 }, 
      React.createElement(Cell, { fill: '#000' })
    )
  );
  console.log("Render result:", renderToString(chart).substring(0, 50) + "...");
} catch (err) {
  console.error("Render failed:", err);
}
