
import React, { useState, useEffect } from 'react';
import { DB } from '../../services/dbSupabase';
import { User, Role } from '../../types';

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await DB.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePaid = async (u: User) => {
    try {
      await DB.users.update(u.id, { isPaid: !u.isPaid });
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleUpdateRole = async (u: User, role: Role) => {
    try {
      await DB.users.update(u.id, { role });
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-8 font-sans animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Managing {users.length} unique identities.</p>
        </div>
        <div className="relative w-full max-w-md">
           <input 
             type="text" 
             placeholder="Filter by name or email..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none bg-white font-bold shadow-sm"
           />
           <svg className="w-5 h-5 absolute right-6 top-4.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-10 py-6">User Identity</th>
              <th className="px-10 py-6">Role</th>
              <th className="px-10 py-6">Tier</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                   <div className="flex items-center space-x-4">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} className="w-10 h-10 rounded-xl bg-slate-50 border" alt="Avatar" />
                      <div>
                         <p className="text-sm font-black text-slate-900">{u.name}</p>
                         <p className="text-[11px] text-slate-400 font-bold">{u.email}</p>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-6">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.role === Role.ADMIN ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {u.role}
                   </span>
                </td>
                <td className="px-10 py-6">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.isPaid ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {u.isPaid ? 'Professional' : 'Free Preview'}
                   </span>
                </td>
                <td className="px-10 py-6 text-right space-x-2">
                   <button 
                     onClick={() => handleTogglePaid(u)} 
                     className="px-4 py-2 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                   >
                     Toggle Access
                   </button>
                   <button 
                     onClick={() => setEditingUser(u)}
                     className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all"
                   >
                     Modify
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-md">
           <div className="bg-white max-w-md w-full p-12 rounded-[3.5rem] shadow-2xl relative">
              <button onClick={() => setEditingUser(null)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h2 className="text-3xl font-black mb-2">Modify Protocol</h2>
              <p className="text-slate-500 text-sm mb-10 font-medium">Update system permissions for {editingUser.name}.</p>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security Clearance (Role)</p>
                 <div className="grid grid-cols-1 gap-3">
                   {Object.values(Role).map(r => (
                     <button 
                       key={r}
                       onClick={() => handleUpdateRole(editingUser, r)}
                       className={`w-full py-4 rounded-2xl border-2 font-black text-sm transition-all ${editingUser.role === r ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                     >
                       {r.toUpperCase()}
                     </button>
                   ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersView;
