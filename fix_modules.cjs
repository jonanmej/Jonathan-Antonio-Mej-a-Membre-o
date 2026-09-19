const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix clients_plants
code = code.replace(/if \(isLoggedIn && activeModule === 'clients_plants'\)/g, "if (isLoggedIn && activeModule === 'clients')");
// Fix field_ops
code = code.replace(/if \(isLoggedIn && activeModule === 'field_ops'\)/g, "if (isLoggedIn && activeModule === 'fieldops')");

// Add comercial module right before 'clients'
const clientsBlock = "  if (isLoggedIn && activeModule === 'clients') {";
const comercialBlock = `  if (isLoggedIn && activeModule === 'comercial') {
    return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300"><CommercialModule onBack={() => setActiveModule('dashboard')} /></div>;
  }

`;
code = code.replace(clientsBlock, comercialBlock + clientsBlock);

fs.writeFileSync('src/App.tsx', code);
