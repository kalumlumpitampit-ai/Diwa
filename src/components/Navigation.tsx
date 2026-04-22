import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { LogIn, LogOut, BookOpen, LayoutDashboard, MessageSquare, ShieldCheck } from 'lucide-react';

export const Navigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const { user, signIn, signOut } = useAuth();
  const { profile } = useData();

  const navItems = [
    { id: 'dashboard', label: profile?.role === 'teacher' || profile?.role === 'admin' ? 'Classroom' : 'My Learning', icon: LayoutDashboard },
    { id: 'chat', label: 'Collaboration', icon: MessageSquare },
  ];

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-900/20 shrink-0">
                <BookOpen size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl md:text-2xl font-bold text-slate-900 leading-none">Diwa Portal</h1>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5 block">Grade 9 Academy</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <NavButton 
                  key={item.id}
                  active={activeTab === item.id} 
                  onClick={() => setActiveTab(item.id)} 
                  icon={<item.icon size={18} />} 
                  label={item.label} 
                />
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-6">
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-6">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end space-x-2">
                      {(profile?.role === 'teacher' || profile?.role === 'admin') && <ShieldCheck size={14} className="text-brand-600" />}
                      <span className="text-sm font-bold text-slate-900">{user.displayName}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400">{profile?.role} Account</span>
                  </div>
                  <button onClick={signOut} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={signIn}
                  className="btn-primary py-2 px-4 flex items-center space-x-2 text-sm"
                >
                  <LogIn size={18} />
                  <span className="hidden xs:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-6 py-3 pb-8">
        <div className="flex justify-around items-center">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center space-y-1 ${
                activeTab === item.id ? 'text-brand-700' : 'text-slate-400'
              }`}
            >
              <item.icon size={24} className={activeTab === item.id ? 'fill-brand-50' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);
