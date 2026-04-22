import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Submission, Assignment, Broadcast, UserProfile } from '../types';
import { 
  Users, FileCheck, Star, Clock, AlertCircle, ChevronDown, 
  CheckCircle2, MessageSquare, Plus, Calendar, Megaphone,
  CheckCircle, XCircle, BookOpen, Link, FileText, Video,
  Trophy, TrendingUp, BarChart, Search, ChevronRight, User, X, Pencil, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const TeacherDashboard: React.FC = () => {
  const { 
    submissions, gradeSubmission, returnSubmission, assignments, createAssignment, deleteAssignment,
    broadcasts, postBroadcast, allStudents, resources, addResource, updateUserProfile
  } = useData();
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const selectedSubmission = submissions.find(s => s.id === selectedSubmissionId) || null;
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [activeView, setActiveView] = useState<'review' | 'create' | 'monitor' | 'resources' | 'leaderboard' | 'analytics' | 'students'>('review');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  const sortedSubmissions = [...submissions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const sortedStudents = [...allStudents].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-24 md:pb-0 px-4 md:px-0">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 italic">Teacher Command Center</h2>
            <p className="text-slate-500 text-sm md:text-base">Monitor student progress, create activities, and broadcast class announcements.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <StatMini icon={<Users className="text-brand-600" />} label="Students" value={allStudents.length.toString()} />
            <StatMini icon={<FileCheck className="text-accent-gold" />} label="Pending" value={pendingCount.toString()} />
            <StatMini icon={<Star className="text-emerald-500" />} label="Graded" value={gradedCount.toString()} />
          </div>
        </div>
      </header>

      <nav className="flex space-x-1 bg-slate-100 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'review', label: 'Review', icon: FileCheck },
          { id: 'create', label: 'Create', icon: Plus },
          { id: 'monitor', label: 'Monitor', icon: Clock },
          { id: 'resources', label: 'Library', icon: BookOpen },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: BarChart }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap ${
              activeView === tab.id ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-brand-600'
            }`}
          >
            <tab.icon size={14} className="md:w-4 md:h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
           <AnimatePresence mode="wait">
             {activeView === 'review' && (
               <motion.div 
                 key="review"
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                 className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
               >
                 <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                   <h3 className="font-serif font-bold text-base md:text-lg text-slate-900">Incoming Student Work</h3>
                   <span className="text-[9px] md:text-[10px] font-black uppercase text-slate-400">Feed</span>
                 </div>
                 <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                   {sortedSubmissions.length === 0 ? (
                     <div className="p-12 text-center">
                       <Clock size={40} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-400 italic">No submissions yet.</p>
                     </div>
                   ) : (
                    sortedSubmissions.map(sub => {
                       const assignment = assignments.find(a => a.id === sub.assignmentId);
                       return (
                         <div 
                           key={sub.id} 
                           className={`p-4 md:p-6 transition-all cursor-pointer hover:bg-slate-50 ${selectedSubmissionId === sub.id ? 'bg-brand-50' : ''}`}
                           onClick={() => setSelectedSubmissionId(sub.id)}
                         >
                           <div className="flex justify-between items-start">
                             <div className="flex items-center space-x-3">
                               <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-xs md:text-sm shrink-0">
                                 {sub.studentName[0]}
                               </div>
                               <div className="min-w-0">
                                 <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{sub.studentName}</h4>
                                 <p className="text-[10px] md:text-xs text-slate-500 truncate">"{assignment?.title || 'Unknown'}"</p>
                               </div>
                             </div>
                             <div className="text-right shrink-0">
                                <span className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 md:py-1 rounded ${
                                  sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-100 text-brand-600'
                                }`}>
                                  {sub.status}
                                </span>
                                <div className="text-[8px] md:text-[10px] text-slate-400 mt-1">{format(new Date(sub.timestamp), 'MMM d, h:mm a')}</div>
                             </div>
                           </div>
                         </div>
                       );
                     })
                   )}
                 </div>
               </motion.div>
             )}

             {activeView === 'create' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                   className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
                 >
                   <div className="flex items-center space-x-3 mb-6">
                     <Plus className="text-brand-600" size={20} />
                     <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 italic">New Activity</h3>
                   </div>
                   <ActivityCreator onSubmit={createAssignment} />
                 </motion.div>

                 <motion.div 
                   initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                   className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
                 >
                   <div className="flex items-center space-x-3 mb-6">
                     <Megaphone className="text-brand-600" size={20} />
                     <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 italic">Post Broadcast</h3>
                   </div>
                   <BroadcastCreator onSubmit={postBroadcast} />
                 </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <Trash2 className="text-rose-500" size={20} />
                        <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 italic">Manage Content</h3>
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-400">{assignments.filter(a => !a.deleted).length} Active Tasks</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assignments.filter(a => !a.deleted).map(a => (
                        <div key={a.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group transition-all hover:bg-white hover:border-brand-100">
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm truncate">{a.title}</h4>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                              {a.questions ? 'Quiz' : 'Activity'} • {a.points} Pts
                            </p>
                          </div>
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to remove \"${a.title}\"? Students will no longer see this task, but their saved scores will remain in their archive.`)) {
                                try {
                                  await deleteAssignment(a.id);
                                  alert("🗑️ Content removed: The task has been withdrawn from the student portal.");
                                } catch (e) {
                                  alert("❌ Error: Could not remove content.");
                                }
                              }
                            }}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      {assignments.filter(a => !a.deleted).length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-300 italic text-sm">
                          No active activities to manage.
                        </div>
                      )}
                    </div>
                  </motion.div>
               </div>
             )}

             {activeView === 'monitor' && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
               >
                 <ActivityMonitor 
                   students={allStudents} 
                   assignments={assignments} 
                   submissions={submissions} 
                   onEditStudent={(s) => {
                     setSelectedStudent(s);
                     setEditedName(s.displayName);
                     setIsEditingName(true);
                   }}
                 />
               </motion.div>
             )}

             {activeView === 'resources' && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                 <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                   <div className="flex items-center space-x-3 mb-6">
                     <BookOpen className="text-brand-600" size={20} />
                     <h3 className="text-lg md:text-xl font-serif font-bold text-slate-900 italic">Curate Resources</h3>
                   </div>
                   <ResourceCreator onSubmit={addResource} />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {resources.map(res => (
                     <div key={res.id} className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start space-x-4">
                       <div className="p-3 bg-brand-50 rounded-2xl text-brand-600">
                         {res.type === 'video' ? <Video size={20} /> : res.type === 'pdf' ? <FileText size={20} /> : <Link size={20} />}
                       </div>
                       <div className="min-w-0 flex-1">
                         <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{res.title}</h4>
                         <p className="text-xs text-slate-500 line-clamp-2 italic mb-3">{res.description}</p>
                         <a href={res.url} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase text-brand-600 hover:underline">Link Content</a>
                       </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}

             {activeView === 'leaderboard' && (
               <motion.div 
                 key="leaderboard"
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
               >
                 <div className="flex items-center space-x-3 mb-8">
                   <Trophy className="text-accent-gold" size={24} />
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 italic">Class Academic Rankings</h3>
                 </div>
                 <div className="space-y-4">
                   {sortedStudents.map((s, i) => (
                     <div 
                       key={s.uid} 
                       onClick={() => setSelectedStudent(s)}
                       className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl transition-all hover:bg-white border border-transparent hover:border-brand-100 cursor-pointer group"
                     >
                       <div className="flex items-center space-x-4">
                         <span className={`w-8 h-8 flex items-center justify-center font-black text-xs rounded-full ${
                           i === 0 ? 'bg-accent-gold text-white shadow-lg shadow-black/10' : 
                           i === 1 ? 'bg-slate-300 text-white' : 
                           i === 2 ? 'bg-orange-300 text-white' : 'text-slate-400'
                         }`}>
                           {i + 1}
                         </span>
                         <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 bg-white border border-slate-100 flex items-center justify-center rounded-lg font-black text-brand-600 text-[10px] uppercase">{s.displayName[0]}</div>
                           <div>
                             <div className="font-bold text-slate-900">{s.displayName}</div>
                             <div className="text-[10px] text-slate-400 uppercase tracking-widest">{s.email}</div>
                           </div>
                         </div>
                       </div>
                       <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2">
                           <span className="text-lg font-black text-brand-900">{s.totalPoints || 0}</span>
                           <span className="text-[9px] font-black text-slate-400 uppercase">Pts</span>
                         </div>
                         <ChevronRight className="text-slate-200 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" size={16} />
                       </div>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}

             {activeView === 'students' && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
               >
                 <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center space-x-3">
                     <Users className="text-brand-600" size={24} />
                     <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 italic">Student Directory</h3>
                   </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {allStudents.map(s => (
                     <div key={s.uid} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl font-black text-brand-600 shadow-sm">{s.displayName[0]}</div>
                         <div>
                           <div className="font-bold text-slate-900">{s.displayName}</div>
                           <div className="text-[10px] text-slate-400">{s.email}</div>
                         </div>
                       </div>
                       <button onClick={() => { setSelectedStudent(s); setEditedName(s.displayName); setIsEditingName(true); }} className="p-2 hover:bg-white rounded-lg text-brand-600">
                         <Pencil size={18} />
                       </button>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}

             {activeView === 'analytics' && (
               <motion.div 
                 key="analytics"
                 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                 className="space-y-8"
               >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                     <div className="flex items-center justify-between mb-8">
                       <h4 className="font-serif font-bold text-lg italic text-slate-900">Score Distribution</h4>
                       <BarChart className="text-slate-300" size={20} />
                     </div>
                     <div className="h-48 flex items-end justify-between px-4 pb-2 border-b border-slate-100">
                       {[40, 70, 90, 60, 85, 95, 30].map((h, i) => (
                         <div key={i} className="w-full mx-1.5 bg-brand-50 rounded-t-lg transition-all hover:bg-brand-600" style={{ height: `${h}%` }}></div>
                       ))}
                     </div>
                   </div>

                   <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                     <div className="flex items-center justify-between mb-8">
                       <h4 className="font-serif font-bold text-lg italic">Engagement Index</h4>
                       <TrendingUp className="text-accent-gold" size={20} />
                     </div>
                     <div className="space-y-6">
                       <div>
                         <div className="flex justify-between text-xs mb-2 uppercase font-black text-white/40">
                           <span>Submission Rate</span>
                           <span>{Math.round((submissions.length / (assignments.length * allStudents.length || 1)) * 100)}%</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent-gold transition-all" style={{ width: `${Math.round((submissions.length / (assignments.length * allStudents.length || 1)) * 100)}%` }}></div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="space-y-8">
          <AnimatePresence>
            {selectedStudent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden sticky top-24"
              >
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-black">{selectedStudent.displayName[0]}</div>
                    <div className="min-w-0 flex-1">
                      {isEditingName ? (
                        <div className="flex items-center space-x-2">
                          <input 
                            value={editedName} 
                            onChange={e => setEditedName(e.target.value)}
                            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white w-full"
                            autoFocus
                          />
                          <button 
                            onClick={async () => {
                              try {
                                await updateUserProfile(selectedStudent.uid, { displayName: editedName });
                                setIsEditingName(false);
                                setSelectedStudent({ ...selectedStudent, displayName: editedName });
                                alert("✨ Name updated: The student's academic profile has been synchronized.");
                              } catch (e) {
                                alert("❌ Error: Could not update the profile name.");
                              }
                            }}
                            className="p-1 text-emerald-400 hover:text-emerald-300"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => setIsEditingName(false)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-lg leading-tight truncate">{selectedStudent.displayName}</h4>
                          <button 
                            onClick={() => {
                              setEditedName(selectedStudent.displayName);
                              setIsEditingName(true);
                            }}
                            className="p-1 text-white/40 hover:text-white transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                        </div>
                      )}
                      <p className="text-[10px] text-white/40 uppercase font-bold">Academic Portfolio</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Class Rank</div>
                      <div className="text-2xl font-black text-brand-900">#{sortedStudents.findIndex(s => s.uid === selectedStudent.uid) + 1}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">Total Pts</div>
                      <div className="text-2xl font-black text-brand-900">{selectedStudent.totalPoints || 0}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                      <User size={12} className="mr-2" />
                      Scholar's Bio
                    </h5>
                    <p className="text-xs text-slate-600 italic leading-relaxed whitespace-pre-wrap">
                      {selectedStudent.bio || "No biography provided."}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 flex items-center">
                      <TrendingUp size={12} className="mr-2" />
                      Learning Goal
                    </h5>
                    <div className="bg-slate-50 p-3 rounded-xl text-xs italic text-brand-900 border-l-4 border-brand-600">
                      "{selectedStudent.learningGoal || "Focusing on core curriculum."}"
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 mb-3">Submission Pulse</h5>
                    <div className="space-y-2">
                      {submissions.filter(s => s.studentId === selectedStudent.uid).slice(0, 2).map(s => (
                        <div key={s.id} className="flex justify-between text-[10px] p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-600">Work Unit</span>
                          <span className="font-black text-brand-600">{s.status === 'graded' ? `${s.score} Pts` : 'Pending'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : selectedSubmission && activeView === 'review' ? (
             <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }} 
               className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-8 sticky top-24"
             >
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 italic">Grading Pane</h3>
                    <button onClick={() => setSelectedSubmissionId(null)} className="text-slate-400 hover:text-slate-600 truncate lg:hidden text-xs">Close</button>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-400 text-[10px] md:text-xs">
                    <Users size={12} />
                    <span>Focusing on {selectedSubmission.studentName}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 md:p-6 italic text-slate-700 text-xs md:text-sm mb-6 leading-relaxed border border-slate-100 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {typeof selectedSubmission.content === 'object' ? (
                    <div className="space-y-4 not-italic">
                      {Object.entries(selectedSubmission.content as Record<string, string>).map(([qid, ans], idx) => {
                        const assignment = assignments.find(a => a.id === selectedSubmission.assignmentId);
                        const question = assignment?.questions?.find(q => q.id === qid);
                        return (
                          <div key={qid} className="pb-4 border-b border-slate-200 last:border-0">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Question {idx + 1}</p>
                            <p className="font-bold text-slate-800 mb-2">{question?.text || qid}</p>
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-brand-900 font-serif">
                              {ans}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    selectedSubmission.content
                  )}
                </div>

                {selectedSubmission.status !== 'graded' ? (
                  <GraderForm 
                    maxPoints={assignments.find(a => a.id === selectedSubmission.assignmentId)?.points || 100}
                    onSubmit={async (score, feedback) => {
                      try {
                        await gradeSubmission(selectedSubmission.id, score, feedback);
                        setSelectedSubmissionId(null);
                        alert("✅ Grade finalized: Academic records have been updated.");
                      } catch (e) {
                        alert("❌ Error: Failed to finalize the grade.");
                      }
                    }} 
                    onReturn={async (feedback) => {
                      try {
                        await returnSubmission(selectedSubmission.id, feedback);
                        setSelectedSubmissionId(null);
                        alert("🔙 Task returned: The student has been notified to revise their work.");
                      } catch (e) {
                        alert("❌ Error: Failed to return the submission.");
                      }
                    }}
                  />
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
                    <div className="flex items-center space-x-2 text-emerald-600 font-bold mb-2">
                      <CheckCircle2 size={18} />
                      <span>Submission Graded</span>
                    </div>
                    <div className="text-2xl md:text-3xl font-serif font-bold text-slate-900 mb-2">{selectedSubmission.score} / {assignments.find(a => a.id === selectedSubmission.assignmentId)?.points}</div>
                    <p className="text-xs md:text-sm text-slate-500 italic">"{selectedSubmission.feedback}"</p>
                    <div className="mt-4 pt-4 border-t border-emerald-100 flex flex-wrap justify-between gap-2 text-[8px] md:text-[10px] uppercase font-black text-emerald-600/60">
                      <span>Submitted: {format(new Date(selectedSubmission.timestamp), 'MMM d, h:mm a')}</span>
                      {selectedSubmission.gradedAt && <span>Graded: {format(new Date(selectedSubmission.gradedAt), 'MMM d, h:mm a')}</span>}
                      {selectedSubmission.returnedAt && <span>Returned: {format(new Date(selectedSubmission.returnedAt), 'MMM d, h:mm a')}</span>}
                    </div>
                  </div>
                )}
             </motion.div>
           ) : (
             <div className="bg-brand-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                <TrendingUp className="text-accent-gold mb-4" size={32} />
                <h3 className="text-lg md:text-xl font-serif font-bold mb-2">Academic Vibe</h3>
                <p className="text-white/60 text-xs md:text-sm italic mb-6 leading-relaxed">Top performing students are automatically elevated. Review work to award points and foster excellence.</p>
                
                {sortedStudents.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                       <span className="text-[9px] font-black uppercase text-accent-gold block mb-1">Top Delegate</span>
                       <div className="font-bold text-sm tracking-tight">{sortedStudents[0].displayName}</div>
                       <div className="text-xs text-white/40">{sortedStudents[0].totalPoints || 0} Academic Credits</div>
                    </div>
                  </div>
                )}
             </div>
           )}
          </AnimatePresence>

           <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200">
              <h3 className="text-base md:text-lg font-serif font-bold text-slate-900 mb-4 italic flex items-center">
                <Megaphone size={20} className="mr-2 text-brand-600" />
                Live Feed
              </h3>
              <div className="space-y-4">
                {broadcasts.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">No announcements posted yet.</p>
                ) : (
                  broadcasts.slice(0, 3).map(b => (
                    <div key={b.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-1">{b.title}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 line-clamp-2 italic mb-2">"{b.message}"</p>
                      <div className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase">{format(new Date(b.createdAt), 'MMM d, h:mm a')}</div>
                    </div>
                  ))
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResourceCreator: React.FC<{ onSubmit: (r: any) => Promise<void> }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'link' | 'pdf' | 'video' | 'document'>('link');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    setLoading(true);
    try {
      await onSubmit({ title, url, description, type });
      alert("📚 Resource shared: Successfully curated into the class library.");
      setTitle(''); setUrl(''); setDescription('');
    } catch (e) {
      alert("❌ Error: Failed to curate resource.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Resource Title</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
            placeholder="Analytical Reading Guide"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Content Type</label>
          <select 
            value={type} onChange={e => setType(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700"
          >
            <option value="link">External Link</option>
            <option value="pdf">PDF Document</option>
            <option value="video">Video Lecture</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Source URL</label>
        <input 
          value={url} onChange={e => setUrl(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          placeholder="https://..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Short Context</label>
        <textarea 
          value={description} onChange={e => setDescription(e.target.value)}
          className="w-full h-20 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
          placeholder="Why is this resource important?"
        />
      </div>
      <button disabled={loading} className="w-full btn-primary bg-slate-900 border-none shadow-xl">
        {loading ? 'Curating...' : 'Publish to Library'}
      </button>
    </form>
  );
};

const StatMini: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
    <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <div className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">{label}</div>
      <div className="text-lg font-bold text-slate-900 leading-tight">{value}</div>
    </div>
  </div>
);

const ActivityCreator: React.FC<{ onSubmit: (a: any) => Promise<void> }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [points, setPoints] = useState(10);
  const [dueDate, setDueDate] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { id: Math.random().toString(36).substr(2, 9), type: 'multiple-choice', text: '', options: [''] }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, updates: any) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Explicit Validation with Popups
    if (!title.trim()) {
      alert("⚠️ Scholarly Title Required: Please name this activity before launching.");
      return;
    }
    if (!instructions.trim()) {
      alert("⚠️ Instructions Missing: Students need clear guidance on how to proceed.");
      return;
    }
    if (!dueDate) {
      alert("⚠️ Temporal Deadline Required: Please set a due date for this submission.");
      return;
    }

    // Question Validation if any added
    if (questions.length > 0) {
      const emptyQuestion = questions.some(q => !q.text.trim());
      if (emptyQuestion) {
        alert("⚠️ Incomplete Questions: Please ensure all quiz questions have text.");
        return;
      }

      const mcQuestions = questions.filter(q => q.type === 'multiple-choice');
      const emptyOptions = mcQuestions.some(q => q.options.some((o: string) => !o.trim()));
      if (emptyOptions) {
        alert("⚠️ Empty Options: Multiple-choice questions require all options to be filled.");
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({ 
        title, 
        instructions, 
        points, 
        dueDate, 
        questions: questions.length > 0 ? questions : undefined 
      });
      alert("✨ Activity Published: The assessment is now live for all students.");
      setTitle('');
      setInstructions('');
      setPoints(10);
      setDueDate('');
      setQuestions([]);
    } catch (error) {
      alert("❌ Submission Failure: There was an error publishing the activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Activity Title</label>
        <input 
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
          placeholder="e.g. Sonnet 18 Structural Analysis"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Instructions</label>
        <textarea 
          value={instructions} onChange={e => setInstructions(e.target.value)}
          className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
          placeholder="Describe what students need to do..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Max Points</label>
          <input 
            type="number" value={points} onChange={e => setPoints(parseInt(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Due Date</label>
          <input 
            type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase text-slate-400">Quiz Content (Optional)</label>
          <button 
            type="button" 
            onClick={addQuestion}
            className="text-[10px] font-black uppercase text-brand-600 flex items-center hover:underline"
          >
            <Plus size={12} className="mr-1" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 relative group">
              <button 
                type="button" 
                onClick={() => removeQuestion(q.id)}
                className="absolute top-2 right-2 text-slate-300 hover:text-rose-500 transition-colors"
              >
                <XCircle size={14} />
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 text-[10px] flex items-center justify-center font-bold">{idx + 1}</span>
                <select 
                  value={q.type} 
                  onChange={e => updateQuestion(q.id, { type: e.target.value })}
                  className="bg-transparent text-[10px] uppercase font-black text-brand-600 focus:outline-none"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="short-answer">Short Answer</option>
                </select>
              </div>

              <input 
                value={q.text} 
                onChange={e => updateQuestion(q.id, { text: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs italic"
                placeholder="Question text..."
              />

              {q.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {q.options.map((opt: string, oIdx: number) => (
                    <div key={oIdx} className="flex items-center space-x-2">
                      <input 
                        value={opt} 
                        onChange={e => {
                          const newOpts = [...q.options];
                          newOpts[oIdx] = e.target.value;
                          updateQuestion(q.id, { options: newOpts });
                        }}
                        className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-[10px]"
                        placeholder={`Option ${oIdx + 1}`}
                      />
                      {oIdx === q.options.length - 1 && q.options.length < 4 && (
                        <button 
                          type="button"
                          onClick={() => updateQuestion(q.id, { options: [...q.options, ''] })}
                          className="text-brand-400 hover:text-brand-600"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <button disabled={loading} className="w-full btn-primary bg-slate-900 border-none shadow-xl">
        {loading ? 'Creating...' : questions.length > 0 ? 'Launch Digital Quiz' : 'Launch Activity'}
      </button>
    </form>
  );
};

const BroadcastCreator: React.FC<{ onSubmit: (b: any) => Promise<void> }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setLoading(true);
    try {
      await onSubmit({ title, message, priority });
      alert("📢 Announcement broadcasted: High-priority signal sent to all devices.");
      setTitle('');
      setMessage('');
    } catch (e) {
      alert("❌ Error: Failed to broadcast signal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Announcement Title</label>
        <input 
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
          placeholder="e.g. Schedule Change"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Message Content</label>
        <textarea 
          value={message} onChange={e => setMessage(e.target.value)}
          className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic font-serif"
          placeholder="What's the update for the class?"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Priority Level</label>
        <select 
          value={priority} onChange={e => setPriority(e.target.value as any)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-brand-700"
        >
          <option value="normal">Normal Priority</option>
          <option value="high">Urgent (Red Alert)</option>
        </select>
      </div>
      <button disabled={loading} className="w-full btn-primary bg-brand-600 border-none shadow-xl">
        {loading ? 'Broadcasting...' : 'Signal Students'}
      </button>
    </form>
  );
};

const ActivityMonitor: React.FC<{ 
  students: UserProfile[]; 
  assignments: Assignment[]; 
  submissions: Submission[];
  onEditStudent: (s: UserProfile) => void;
}> = ({ students, assignments, submissions, onEditStudent }) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(assignments[0]?.id || '');

  const activity = assignments.find(a => a.id === selectedActivityId);
  const relevantSubmissions = submissions.filter(s => s.assignmentId === selectedActivityId);
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-slate-900 italic">Participation Tracking</h3>
          <p className="text-slate-500 text-xs">Monitor real-time completion status for specific activities.</p>
        </div>
        <select 
          value={selectedActivityId} 
          onChange={e => setSelectedActivityId(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700"
        >
          <option value="">Select Activity</option>
          {assignments.filter(a => !a.deleted).map(a => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
      </div>

      {!activity ? (
        <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-300">
           Select an activity to see student progress.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map(student => {
            const submission = relevantSubmissions.find(s => s.studentId === student.uid);
            return (
              <div key={student.uid} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    submission ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {student.displayName[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-bold text-slate-900 underline-offset-4 decoration-2">{student.displayName}</div>
                      <button 
                        onClick={() => onEditStudent(student)}
                        className="p-1 text-slate-300 hover:text-brand-600 transition-colors"
                      >
                        <Pencil size={12} />
                      </button>
                    </div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{student.email}</div>
                  </div>
                </div>
                <div>
                  {submission ? (
                    <div className="flex items-center space-x-1 text-emerald-600">
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black text-center uppercase">{submission.status}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-amber-500">
                      <XCircle size={14} />
                      <span className="text-[10px] font-black uppercase">Not Finished</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {students.length === 0 && <p className="col-span-2 text-center text-slate-400 text-xs italic">No students registered in the system yet.</p>}
        </div>
      )}
    </div>
  );
};

const GraderForm: React.FC<{ maxPoints: number; onSubmit: (s: number, f: string) => Promise<void>; onReturn: (f: string) => Promise<void> }> = ({ maxPoints, onSubmit, onReturn }) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onSubmit(score, feedback);
    setLoading(false);
  };

  const handleReturn = async () => {
    if (!feedback) {
      alert("Please provide feedback for the revision.");
      return;
    }
    setLoading(true);
    await onReturn(feedback);
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Numerical Score (Max {maxPoints})</label>
        <div className="flex items-center space-x-4">
          <input 
            type="range" min="0" max={maxPoints} value={score} onChange={(e) => setScore(parseInt(e.target.value))}
            className="flex-1 accent-brand-600"
          />
          <span className="font-bold text-brand-700 text-xl">{score}</span>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-400">Pedagogical Feedback</label>
        <textarea 
          placeholder="Constructive advice for the student..." 
          className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all italic text-slate-600"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="flex-1 btn-primary bg-brand-600 border-none shadow-xl py-3 rounded-xl text-white font-bold"
        >
          {loading ? 'Grading...' : 'Finalize Grade'}
        </button>
        <button 
          onClick={handleReturn} 
          disabled={loading}
          className="flex-1 bg-amber-50 text-amber-700 border border-amber-100 py-3 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center space-x-2"
        >
          <Clock size={14} />
          <span>Return for Revision</span>
        </button>
      </div>
    </div>
  );
}
