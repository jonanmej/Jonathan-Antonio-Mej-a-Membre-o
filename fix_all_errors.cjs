const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix isSidebarCollapsed and commercial button styling
const badButtonRegex = /<button[\s\S]*?onClick=\{\(\) => setActiveModule\('comercial'\)\}[\s\S]*?<\/button>/;
const goodButton = `
            <button onClick={() => setActiveModule('comercial')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Área Comercial</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Catálogos y ventas.</p>
              </div>
            </button>`;
            
code = code.replace(badButtonRegex, goodButton);

// Fix login variables
code = code.replace(/setAuthError\(/g, "setToastMessage({ show: true, message: ");
code = code.replace(/setToastMessage\(\{ show: true, message: (.*?)\);/g, "setToastMessage({ show: true, message: $1 });");
code = code.replace(/setUserRole\(/g, "setCurrentUserRole(");
code = code.replace(/setUserName\(/g, "setCurrentUser(");
code = code.replace(/setIsAuthenticated\(/g, "setIsLoggedIn(");

// Remove setInternalRole because it doesn't exist and isn't strictly needed if we just set currentUserRole to 'admin'
code = code.replace(/setInternalRole\([^)]+\);/g, "");

fs.writeFileSync('src/App.tsx', code);
