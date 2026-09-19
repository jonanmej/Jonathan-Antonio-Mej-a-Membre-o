import { useState, useEffect } from 'react';
import BackToDashboardButton from './BackToDashboardButton';
import { Users, Shield, FileText, Activity, CheckCircle2, XCircle, ArrowLeft, ShieldAlert, UserPlus, Mail, Search, Key, Lock, Unlock } from 'lucide-react';
import { collection, onSnapshot, query, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { db, firebaseConfig } from '../firebase';

// Helper to generate a strong password
const generateStrongPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+~|}{[]:;?><,./-=";
  let pass = "";
  pass += chars[Math.floor(Math.random() * chars.length)];
  pass += nums[Math.floor(Math.random() * nums.length)];
  pass += syms[Math.floor(Math.random() * syms.length)];
  for(let i=0; i<7; i++) {
      const all = chars + nums + syms;
      pass += all[Math.floor(Math.random() * all.length)];
  }
  return pass;
};


interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  lastSession?: any;
  createdAt?: any;
}

interface Report {
  id: string;
  categoryName: string;
  serviceName: string;
  clientName: string;
  date: string;
  userId: string;
}

export default function AdminDashboard({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showNewUser, setShowNewUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({ 
    email: '', 
    displayName: '', 
     
    role: 'Técnico' 
  });
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    setLoading(true);
    // Fetch reports from API
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => setReports(data))
      .catch(err => console.error("Failed to fetch reports", err));

    // Listen to Firebase Users
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData: User[] = [];
      snapshot.forEach((document) => {
        usersData.push({ id: document.id, ...document.data() } as User);
      });
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore users error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);
    try {
      const password = generateStrongPassword();
      setGeneratedPassword(password);
      
      // Use secondary app to prevent logging out admin
      const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, password);
      
      // Save to firestore
      const internalRole = ['Supervisor', 'Gerente', 'Usuario Maestro'].includes(newUser.role) ? 'admin' : 'technician';
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        internalRole: internalRole,
        
        isActive: true,
        mustChangePassword: true,
        createdAt: serverTimestamp(),
        lastSession: null
      });

      // Send password reset email
      try {
        await sendPasswordResetEmail(secondaryAuth, newUser.email);
      } catch(emailErr) {
        console.error("Could not send email:", emailErr);
      }

      await signOut(secondaryAuth);

      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: `Usuario creado exitosamente.\n\nSe ha enviado un correo a ${newUser.email} para que el usuario restablezca su contraseña.\n\n(Nota: Si el correo no llega por configuraciones de Firebase, la contraseña temporal generada es: ${password})` } }));
      
      setShowNewUser(false);
      setNewUser({ 
        email: '', 
        displayName: '', 
         
        role: 'Técnico' 
      });
    } catch (err: any) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: 'Error al crear usuario: ' + err.message } }));
    } finally {
      setIsCreatingUser(false);
    }
  };

  
  const toggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isActive: !currentStatus
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        internalRole: ['Supervisor', 'Gerente', 'Usuario Maestro'].includes(newRole) ? 'admin' : 'technician'
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-slate-500 dark:text-slate-400">Cargando consola de administración...</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[70vh]">
      <div className="bg-slate-900 px-6 py-5 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><Shield className="w-6 h-6 text-emerald-400" /> Consola Maestra</h2>
          <p className="text-sm text-slate-400 mt-1">Gestión de Accesos, Usuarios y Trazabilidad</p>
        </div>
        {onBack && (
          <BackToDashboardButton 
            id="btn-admin-back"
            onClick={onBack}
            variant="dark"
          />
        )}
      </div>
      
      <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'users' ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <Users className="w-5 h-5" /> Gestión de Usuarios
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-4 text-sm font-bold flex justify-center items-center gap-2 transition-colors ${activeTab === 'reports' ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          <FileText className="w-5 h-5" /> Repositorio Global de Reportes
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'users' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Directorio de Personal</h3>
              <button 
                onClick={() => setShowNewUser(!showNewUser)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Registrar Usuario
              </button>
            </div>
            
            <div className="mb-4 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o correo electrónico..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
              />
            </div>
            
            {showNewUser && (
              <form onSubmit={handleCreateUser} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-emerald-700 mb-2 border-b border-emerald-100 pb-2">
                  <Shield className="w-5 h-5" />
                  <h4 className="font-bold">Alta de Nuevo Personal</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Nombre Completo</label>
                    <input required value={newUser.displayName} onChange={e => setNewUser({...newUser, displayName: e.target.value})} type="text" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Correo Corporativo</label>
                    <input required value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} type="email" className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="juan.perez@easervice.app" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Rol Operativo</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:border-emerald-500 outline-none">
                      <option value="Auxiliar">Auxiliar</option>
                      <option value="Operador">Operador</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Usuario Maestro">Usuario Maestro</option>
                    </select>
                  </div>
                  
                </div>
                
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3 mt-2">
                  <Mail className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>Generación Segura:</strong> El sistema creará una contraseña aleatoria y enviará un enlace seguro al correo proporcionado para que el usuario pueda establecer su propia clave.
                  </p>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button type="button" onClick={() => setShowNewUser(false)} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 text-sm font-bold mr-2">Cancelar</button>
                  <button disabled={isCreatingUser} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors disabled:opacity-50">
                    {isCreatingUser ? 'Procesando...' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            )}

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Usuario</th>
                      <th className="px-4 py-3">Contacto</th>
                      <th className="px-4 py-3">Rol Asignado</th>
                      <th className="px-4 py-3">Última Sesión</th>
                      <th className="px-4 py-3 text-right">Estado / Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                    {users.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No hay usuarios registrados en la base de datos.</td></tr>
                    ) : users.filter(u => (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())).map(u => {
                      const lastSessionDate = u.lastSession?.toDate ? u.lastSession.toDate() : null;
                      const isRecent = lastSessionDate ? (new Date().getTime() - lastSessionDate.getTime()) < 24 * 60 * 60 * 1000 : false;
                      
                      return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-800 dark:text-slate-100">{u.displayName || 'Sin nombre'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-600 dark:text-slate-300">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={u.role || 'Técnico'} 
                            onChange={(e) => {
                               updateRole(u.id, e.target.value);
                            }}
                            className="text-xs border border-slate-200 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-800 hover:border-emerald-500 focus:outline-none focus:border-emerald-500 font-bold text-slate-700 dark:text-slate-200"
                          >
                            <option value="Auxiliar">Auxiliar</option>
                            <option value="Operador">Operador</option>
                            <option value="Técnico">Técnico</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Usuario Maestro">Usuario Maestro</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {lastSessionDate ? (
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${isRecent ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                              <span className={isRecent ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                                {lastSessionDate.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Nunca</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={async () => {
                                 try {
                                   await sendPasswordResetEmail(getAuth(), u.email);
                                   window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Correo de restablecimiento enviado a " + u.email } }));
                                 } catch(e: any) {
                                   window.dispatchEvent(new CustomEvent('app-toast', { detail: { message: "Error: " + e.message } }));
                                 }
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
                              title="Resetear Contraseña"
                            >
                              <Key className="w-3.5 h-3.5" /> Resetear
                            </button>
                            <button 
                              onClick={() => toggleActive(u.id, u.isActive)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border ${u.isActive ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                              title={u.isActive ? 'Bloquear Acceso' : 'Desbloquear Acceso'}
                            >
                              {u.isActive ? <><Lock className="w-3.5 h-3.5" /> Bloquear</> : <><Unlock className="w-3.5 h-3.5" /> Desbloquear</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Trazabilidad de Reportes</h3>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-blue-200">
                <Activity className="w-4 h-4" /> En vivo
              </div>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3">Servicio</th>
                    <th className="px-4 py-3">Técnico ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-800">
                  {reports.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No hay reportes recientes.</td></tr>
                  ) : reports.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.clientName || 'N/A'}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.categoryName}</td>
                      <td className="px-4 py-3 font-medium text-emerald-700">{r.serviceName}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{r.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
