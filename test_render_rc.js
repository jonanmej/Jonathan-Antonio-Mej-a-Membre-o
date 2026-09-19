import React from 'react';
import { renderToString } from 'react-dom/server';
import { ResponsiveContainer, PieChart, Pie } from 'recharts';

try {
  const chart = React.createElement(ResponsiveContainer, { width: "100%", height: 200 }, 
    React.createElement(PieChart, { width: 400, height: 400 }, 
      React.createElement(Pie, { data: [{name: 'A', value: 10}], dataKey: 'value', cx: '50%', cy: '50%', outerRadius: 50 })
    )
  );
  console.log("Render result:", renderToString(chart).substring(0, 50) + "...");
} catch (err) {
  console.error("Render failed:", err);
}
