const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf-8');
// Just checking brackets or tags is hard, let's just use `tsc` or `vite` output
