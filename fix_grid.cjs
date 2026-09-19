const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const regex = /<p className="text-slate-600 dark:text-slate-300 text-sm mb-4">[\s\S]*?Utilice <strong>Operaciones en Campo<\/strong> para levantar reportes\. La aplicación funciona con soporte <strong>offline<\/strong>; sus datos se guardarán automáticamente si pierde conexión y se sincronizarán al recuperar la red\.[\s\S]*?<\/p>[\s\S]*?<button onClick=\{\(\) => setActiveModule\('comercial'\)\}/;

const replacement = `
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Navegue entre los módulos principales usando el panel de control. Utilice <strong>Operaciones en Campo</strong> para levantar reportes. La aplicación funciona con soporte <strong>offline</strong>; sus datos se guardarán automáticamente si pierde conexión y se sincronizarán al recuperar la red.
              </p>
              <button 
                onClick={() => {
                  setShowTour(false);
                  localStorage.setItem('tourCompleted', 'true');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all shadow-sm shadow-emerald-500/20"
              >
                Comenzar
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <button onClick={() => setActiveModule('clients')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Clientes y Plantas</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de cartera de clientes y activos fotovoltaicos.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('fieldops')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Operaciones en Campo (FSM)</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Órdenes de trabajo, check-in GPS y levantamiento de reportes.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('inventory')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Inventario y Recursos</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Control de herramientas, equipos, EPP y almacén.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('hr')} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col gap-4 group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recursos Humanos</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de personal, planillas y control de horas.</p>
              </div>
            </button>

            <button onClick={() => setActiveModule('comercial')}
`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', code);
