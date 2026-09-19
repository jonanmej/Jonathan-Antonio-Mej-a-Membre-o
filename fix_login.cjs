const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The block starts at `if (mustChangePasswordMode) {`
const blockStartStr = `  if (mustChangePasswordMode) {
      return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Actualiza tu contraseña</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Por políticas de seguridad, debes cambiar la contraseña temporal generada por el sistema.
              </p>
            </div>`;

// Find where this block is
const blockStartIdx = code.indexOf('if (mustChangePasswordMode) {');
if (blockStartIdx === -1) {
    console.log("Could not find mustChangePasswordMode block");
    process.exit(1);
}

const replacementStartStr = `  if (mustChangePasswordMode) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-500 mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Actualiza tu contraseña</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Por políticas de seguridad, debes cambiar la contraseña temporal generada por el sistema.
            </p>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== confirmNewPassword) {
                setToastMessage({ show: true, message: 'Las contraseñas no coinciden.' });
                return;
              }
              try {
                setChangingPassword(true);
                const user = auth.currentUser;
                if (!user) throw new Error('No hay usuario activo');
                await updatePassword(user, newPassword);
                const userDocRef = doc(db, 'users', user.uid);
                await updateDoc(userDocRef, { mustChangePassword: false });
                setMustChangePasswordMode(false);
                setIsLoggedIn(true);
                setToastMessage({ show: true, message: 'Contraseña actualizada exitosamente.' });
              } catch (error: any) {
                setToastMessage({ show: true, message: error.message || 'Error al actualizar contraseña.' });
              } finally {
                setChangingPassword(false);
              }
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">Confirmar Nueva Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={changingPassword}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70"
            >
              {changingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- STANDARD LOGIN / SIGNUP SCREEN ---
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 max-w-md w-full relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {isForgotPasswordMode ? 'Recuperar Cuenta' : isSignUpMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isForgotPasswordMode 
              ? 'Ingresa tu correo para recibir un enlace de recuperación.'
              : isSignUpMode 
                ? 'Ingresa tus datos para registrarte en el sistema.' 
                : 'Accede al panel de control de EA Service.'}
          </p>
        </div>`;

code = code.replace(blockStartStr, replacementStartStr);

// We need to fix the closing brace of the whole component if it got messed up.
// Currently the end of the file is just the login form rendering.
// So replacing `blockStartStr` with the above will effectively close the `mustChangePasswordMode` block properly,
// and start the normal login block's `return (` exactly where the old form started.
// Because the old form started immediately after `blockStartStr` anyway.
// Wait, the old form was `<form onSubmit={async (e) => { ...`. 
// So `replacementStartStr` ends right before the `<form onSubmit...` of the standard login.
// This is perfect!

fs.writeFileSync('src/App.tsx', code);
