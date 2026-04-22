import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';
import { Navigation } from './components/Navigation';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { Collaboration } from './components/Collaboration';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from './contexts/AuthContext';
import { BookOpen } from 'lucide-react';

const AppView: React.FC = () => {
  const { user, signIn, signOut } = useAuth();
  const { profile, loading } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('student');
  const [error, setError] = useState<string | null>(null);

  // Validate domain and role after sign in
  React.useEffect(() => {
    if (user && !profile && !loading) {
      const email = user.email || '';
      const isDepEd = email.endsWith('@deped.gov.ph');
      const isGmail = email.endsWith('@gmail.com');

      // Domain check based on intended role selection
      if (selectedRole === 'teacher' && !isDepEd) {
        setError('Teachers must use a @deped.gov.ph account.');
        signOut();
      } else if (selectedRole === 'student' && !isGmail) {
        setError('Students must use a @gmail.com account.');
        signOut();
      } else {
        setError(null);
      }
    }
  }, [user, profile, loading, selectedRole, signOut]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 md:p-12 text-center border border-slate-200">
           <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 md:mb-8 shadow-2xl shadow-brand-900/40">
             <BookOpen size={40} />
           </div>
           <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2 italic px-2">Diwa Grade 9 Portal</h1>
           <p className="text-slate-500 mb-6 md:mb-8 text-sm md:text-base px-4 leading-relaxed">Choose your role and sign in with your school account to begin.</p>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
             <button 
               onClick={() => { setSelectedRole('student'); setError(null); }}
               className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                 selectedRole === 'student' ? 'border-brand-600 bg-brand-50/50' : 'border-slate-100 hover:border-slate-200'
               }`}
             >
               <span className="text-2xl">🎓</span>
               <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'student' ? 'text-brand-900' : 'text-slate-400'}`}>Student</span>
             </button>
             <button 
               onClick={() => { setSelectedRole('teacher'); setError(null); }}
               className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                 selectedRole === 'teacher' ? 'border-brand-600 bg-brand-50/50' : 'border-slate-100 hover:border-slate-200'
               }`}
             >
               <span className="text-2xl">👨‍🏫</span>
               <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRole === 'teacher' ? 'text-brand-900' : 'text-slate-400'}`}>Teacher</span>
             </button>
           </div>

           {error && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
               className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-bold uppercase tracking-tight"
             >
               {error}
             </motion.div>
           )}

           <button 
             onClick={() => {
                localStorage.setItem('intendedRole', selectedRole);
                signIn();
             }}
             className="w-full btn-primary py-4 text-sm font-black uppercase tracking-widest"
           >
             Continue to Google
           </button>

           <div className="mt-8 pt-8 border-t border-slate-50">
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
               Teacher: @deped.gov.ph | Student: @gmail.com
             </p>
           </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 md:pb-0">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {profile?.role === 'teacher' || profile?.role === 'admin' ? <TeacherDashboard /> : <StudentDashboard />}
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Collaboration />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="hidden md:block py-12 border-t border-slate-200 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">© 2024 Diwa Grade 9 English Academy • Crafted for Filipino Education</p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppView />
      </DataProvider>
    </AuthProvider>
  );
}
