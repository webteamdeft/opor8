
import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { User, Role } from '../types';
import { 
  IconDashboard, 
  IconBuilder, 
  IconDocs, 
  IconBilling, 
  IconSettings, 
  IconSupport,
  IconChevronRight 
} from './Icons';
import { Tooltip } from './Tooltip';

interface LayoutProps {
  user: User;
}

const Layout: React.FC<LayoutProps> = ({ user }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user.role === Role.ADMIN;

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: IconDashboard },
    { path: '/builder', label: 'SOP Pack Builder', icon: IconBuilder },
    { path: '/library', label: 'My Documents', icon: IconDocs },
    { path: '/billing', label: 'Billing', icon: IconBilling },
    { path: '/settings', label: 'Settings', icon: IconSettings },
    { path: '/support', label: 'Support & Help', icon: IconSupport },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Platform Stats', icon: IconDashboard },
    { path: '/admin/users', label: 'User Management', icon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { path: '/admin/payments', label: 'Revenue Ledger', icon: IconBilling },
    { path: '/admin/help-center', label: 'Help Center CMS', icon: IconDocs },
    { path: '/admin/support', label: 'Support & Live Chat', icon: IconSupport },
    { path: '/settings', label: 'Admin Settings', icon: IconSettings },
  ];

  const activeMenuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside 
        className={`bg-white border-r border-slate-200 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed lg:relative inset-y-0 left-0 z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-[88px] w-72' : 'w-72'}`}
      >
        <div className="h-20 px-6 flex items-center justify-between shrink-0">
          {!isSidebarCollapsed ? (
            <div className="flex items-center space-x-3 animate-fadeIn">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-300 hover:rotate-12 ${isAdmin ? 'bg-slate-900 shadow-slate-200' : 'bg-indigo-600 shadow-indigo-100'}`}>O</div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">OPOR8</span>
              {isAdmin && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded ml-2">ADMIN</span>}
            </div>
          ) : (
            <div className="w-full flex justify-center">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-300 hover:scale-110 ${isAdmin ? 'bg-slate-900 shadow-slate-200' : 'bg-indigo-600 shadow-indigo-100'}`}>O</div>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {activeMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} content={isSidebarCollapsed ? item.label : ''}>
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full group relative flex items-center rounded-2xl transition-all duration-300 ease-out ${
                    isSidebarCollapsed ? 'justify-center py-3.5' : 'px-4 py-3.5'
                  } ${
                    isActive 
                      ? (isAdmin ? 'bg-slate-900 text-white shadow-xl shadow-slate-200/50 translate-x-1.5' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200/50 translate-x-1.5')
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`}
                >
                  <div className={`transition-transform duration-300 ${isActive ? 'scale-100' : 'group-hover:scale-110 group-active:scale-90'}`}>
                    <item.icon className={`w-6 h-6 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                    }`} />
                  </div>
                  {!isSidebarCollapsed && (
                    <span className={`ml-4 text-sm font-bold tracking-tight transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                    }`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
          <button 
            onClick={() => { navigate('/settings'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center rounded-2xl p-3 transition-all duration-300 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 ${
              isSidebarCollapsed ? 'justify-center' : 'space-x-4'
            }`}
          >
            <div className="relative shrink-0 transition-transform group-hover:scale-105">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                className="w-10 h-10 rounded-xl bg-indigo-100 ring-2 ring-white shadow-sm group-hover:ring-indigo-100 transition-all" 
                alt="Profile" 
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
            </div>
            {!isSidebarCollapsed && (
              <div className="text-left overflow-hidden">
                <p className="text-sm font-black text-slate-900 truncate leading-none mb-1 group-hover:text-indigo-600 transition-colors">{user.name}</p>
                <div className="flex items-center space-x-1">
                   <span className="text-[10px] font-black uppercase text-slate-400 truncate tracking-widest leading-none">{user.role}</span>
                </div>
              </div>
            )}
          </button>
          
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="mt-4 w-full flex items-center justify-center p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-all group active:scale-95"
          >
            <div className={`transition-transform duration-500 ${isSidebarCollapsed ? 'rotate-180' : ''}`}>
               <IconChevronRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <header className={`h-16 lg:h-20 backdrop-blur-xl border-b px-4 sm:px-10  flex items-center justify-between shrink-0 z-20 sticky top-0 transition-all duration-500 ${isAdmin ? 'bg-slate-900/95 text-white border-white/10 shadow-lg' : 'bg-white/90 border-slate-200/60 shadow-sm'}`}>
          <div className="flex items-center space-x-4 lg:space-x-6 gap-2 sm:gap-5 md:gap-0">
            <div className='bg-indigo-600 rounded-xl'>
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className={`lg:hidden p-2 rounded-xl transition-all active:scale-90 ${isAdmin ? 'text-white hover:bg-white/10' : 'text-white hover:bg-slate-100'}`}
             >
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 {isMobileMenuOpen ? (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 ) : (
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 )}
               </svg>
             </button>
             </div>
             <div className="flex flex-col">
               <h2 className={`text-lg sm:text-xl lg:text-2xl font-black capitalize tracking-tighter leading-none ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
                 {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
               </h2>
             </div>
          </div>
          {/* <div className="flex items-center space-x-5">
             <button className={`p-2.5 rounded-xl relative transition-all group ${isAdmin ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
               <svg className="w-6 h-6 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
               <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white ring-2 ring-indigo-500/20"></span>
             </button>
          </div> */}
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
