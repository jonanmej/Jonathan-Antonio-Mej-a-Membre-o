const user = { email: 'jonathanmembreno838@gmail.com' };
let fetchedInternalRole = 'technician';
if (user.email?.toLowerCase().includes('admin') || user.email?.toLowerCase() === 'jonathanmembreno838@gmail.com') {
    fetchedInternalRole = 'admin';
}
console.log(fetchedInternalRole);
