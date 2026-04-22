import React, { useState } from 'react';
import { UNITS, LESSONS } from '../constants';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Book, CheckCircle, Clock, ChevronRight, FileText, 
  Send, Lightbulb, UserCheck, MessageCircle, Megaphone,
  Calendar, AlertTriangle, Trophy, BookOpen, LayoutDashboard,
  TrendingUp, Video, Link, StickyNote, User, Save, Trash2, Star
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Lesson, Assignment, Broadcast, Resource, Note } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export const StudentDashboard: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources' | 'grades' | 'leaderboard' | 'journal' | 'profile'>('curriculum');
  const { submissions, submitAssignment, assignments, broadcasts, resources, allStudents, profile, notes, addNote, deleteNote, updateProfile } = useData();
  const { user } = useAuth();
  
  const getAssignmentStatus = (id: string) => {
    return submissions.find(s => s.assignmentId === id);
  };

  const getLessonAssignments = (lessonId: string) => {
    return assignments.filter(a => a.lessonId === lessonId && !a.deleted);
  };

  const generalActivities = assignments.filter(a => !a.lessonId && !a.deleted);
  const sortedStudents = [...allStudents].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));

  if (selectedLesson) {
    const lessonAssignments = getLessonAssignments(selectedLesson.id);

    return (
      <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-24 md:pb-0 px-4 md:px-0">
        <button 
          onClick={() => setSelectedLesson(null)}
          className="flex items-center text-brand-600 font-bold hover:text-brand-900 transition-colors group text-sm md:text-base"
        >
          <ChevronRight size={18} className="rotate-180 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Curriculum
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
               <div className="flex flex-wrap items-center gap-3 mb-6">
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">Unit Content</span>
                 <span className="text-[9px] md:text-[10px] font-bold text-slate-400 capitalize">• {selectedLesson.vocabulary.length} Key Terms</span>
               </div>
               <h1 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 mb-6 md:mb-8 border-b border-slate-100 pb-6 italic leading-tight">
                 {selectedLesson.title}
               </h1>
               
               <div className="markdown-body prose prose-sm md:prose-base lg:prose-lg prose-slate max-w-none">
                 <ReactMarkdown>{selectedLesson.discussionText}</ReactMarkdown>
               </div>

               <div className="mt-8 md:mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h3 className="flex items-center text-base md:text-lg font-serif font-bold text-slate-900 italic">
                     <MessageCircle size={20} className="mr-2 text-brand-600" />
                     Discussion Prompts
                   </h3>
                   <ul className="space-y-3">
                     {selectedLesson.prompts.map((p, i) => (
                       <li key={i} className="bg-slate-50 p-4 rounded-xl text-slate-700 text-xs md:text-sm italic">{p}</li>
                     ))}
                   </ul>
                 </div>
                 <div className="space-y-4">
                   <h3 className="flex items-center text-base md:text-lg font-serif font-bold text-slate-900 italic">
                     <Lightbulb size={20} className="mr-2 text-accent-gold" />
                    Reflection activities
                  </h3>
                  <ul className="space-y-3 font-sans">
                    {selectedLesson.activities.map((a, i) => (
                      <li key={i} className="flex items-start text-slate-600 text-xs md:text-sm">
                        <span className="w-5 h-5 bg-brand-50 text-brand-600 text-[9px] items-center justify-center flex rounded-full mr-3 shrink-0 mt-0.5 font-black">{i+1}</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Digital Workbook Integration */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-3 mb-6">
                  <StickyNote className="text-brand-600" size={20} />
                  <h3 className="text-xl font-serif font-bold text-slate-900 italic">Digital Workbook</h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-6 italic">Compose your response to any of the activities above. Your entry will be saved to your personal Literary Journal.</p>
                  <JournalCreator 
                    onSubmit={async (note) => {
                      await addNote({
                        title: `[${selectedLesson.title}] Activity Response`,
                        content: note.content
                      });
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
               <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 italic">Assessments</h2>
               <div className="space-y-6 relative z-10">
                 {lessonAssignments.map(a => {
                    const submission = getAssignmentStatus(a.id);
                    return (
                      <div key={a.id} className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-2xl">
                         <div className="flex justify-between items-start mb-3">
                           <div className="min-w-0 pr-2">
                             <h4 className="font-bold text-white/90 text-sm md:text-base truncate">{a.title}</h4>
                             <div className="flex items-center space-x-1 text-[8px] md:text-[9px] text-white/40 mt-1 uppercase font-black">
                               <Calendar size={10} />
                               <span>Due: {format(new Date(a.dueDate), 'MMM d, h:mm a')}</span>
                             </div>
                           </div>
                           <span className="text-[8px] md:text-[10px] font-black text-accent-gold uppercase tracking-tighter bg-white/10 px-2 py-0.5 md:py-1 rounded shrink-0">{a.points} Pts</span>
                         </div>
                         <p className="text-[10px] md:text-xs text-white/50 mb-6 leading-relaxed italic">{a.instructions}</p>
                         
                         {submission && submission.status !== 'returned' ? (
                           <SubmissionStatus submission={submission} points={a.points} />
                         ) : (
                           <div className="space-y-4">
                             {submission && submission.status === 'returned' && (
                               <SubmissionStatus submission={submission} points={a.points} />
                             )}
                             <AssignmentSubmitter assignment={a} onSubmit={async (content) => {
                               await submitAssignment({
                                 assignmentId: a.id,
                                 studentId: user?.uid || '',
                                 studentName: user?.displayName || 'Unknown',
                                 content
                               });
                             }} />
                           </div>
                         )}
                      </div>
                    );
                 })}
                 {lessonAssignments.length === 0 && <p className="text-white/30 text-sm italic text-center">No assessments assigned yet.</p>}
               </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200">
               <h3 className="text-base md:text-lg font-serif font-bold text-slate-900 mb-4 italic flex items-center">
                 <UserCheck size={20} className="mr-2 text-brand-600" />
                 Context
               </h3>
               <p className="text-slate-600 text-xs md:text-sm leading-relaxed italic">
                 {selectedLesson.culturalContext}
               </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 pb-24 md:pb-0 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 md:pt-0">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 italic tracking-tight">Student Portal</h2>
          <p className="text-slate-500 text-sm md:text-base">Track your academic progress and explore literary resources.</p>
        </div>
        <div className="flex flex-wrap gap-3 self-start md:self-auto">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-3">
             <div className="p-2 bg-brand-50 rounded-lg text-brand-600"><Star size={16} /></div>
             <div>
               <div className="text-[8px] font-black uppercase text-slate-400">Total Credits</div>
               <div className="text-lg font-black text-slate-900 leading-tight">{profile?.totalPoints || 0}</div>
             </div>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-3 text-white">
             <div className="p-2 bg-white/10 rounded-lg text-accent-gold"><Trophy size={16} /></div>
             <div>
               <div className="text-[8px] font-black uppercase text-white/40">Global Rank</div>
               <div className="text-lg font-black leading-tight text-white/90">#{sortedStudents.findIndex(s => s.uid === user?.uid) + 1}</div>
             </div>
          </div>
        </div>
      </header>

      <nav className="flex space-x-1 bg-slate-100 p-1 rounded-2xl w-full overflow-x-auto no-scrollbar">
        {[
          { id: 'curriculum', label: 'Curriculum', icon: LayoutDashboard },
          { id: 'resources', label: 'Library', icon: BookOpen },
          { id: 'grades', label: 'Grades', icon: FileText },
          { id: 'leaderboard', label: 'Rankings', icon: Trophy },
          { id: 'journal', label: 'Journal', icon: StickyNote },
          { id: 'profile', label: 'Profile', icon: User }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 md:px-6 py-2.5 rounded-xl font-bold text-[10px] md:text-xs transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-brand-600'
            }`}
          >
            <tab.icon size={14} className="md:w-4 md:h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        {activeTab === 'curriculum' && (
          <motion.div 
            key="curriculum"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-8 md:space-y-12"
          >
            {/* Teacher Broadcasts Section */}
            {broadcasts.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Megaphone className="text-brand-600" size={24} />
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 italic">Announcements</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {broadcasts.map(b => (
                    <motion.div 
                      key={b.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-5 md:p-6 rounded-3xl border-2 transition-all ${
                        b.priority === 'high' 
                        ? 'bg-rose-50 border-rose-100 shadow-rose-100/50 shadow-lg' 
                        : 'bg-white border-slate-100 shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className={`font-bold text-base md:text-lg ${b.priority === 'high' ? 'text-rose-700' : 'text-slate-900'}`}>{b.title}</h4>
                        {b.priority === 'high' && <AlertTriangle size={18} className="text-rose-500 shrink-0 ml-2" />}
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 mb-6 italic leading-relaxed">"{b.message}"</p>
                      <div className="flex justify-between items-center pt-4 border-t border-slate-100/50">
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-400">{b.authorName}</span>
                        <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-400">{format(new Date(b.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* General Activities Section */}
            {generalActivities.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-baseline space-x-3">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900">Current Activities</h3>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-600">Action Items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {generalActivities.map(a => {
                    const submission = getAssignmentStatus(a.id);
                    return (
                      <div key={a.id} className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg md:text-xl font-bold text-white/90">{a.title}</h4>
                            <span className="text-[8px] md:text-[10px] font-black text-accent-gold uppercase tracking-tighter bg-white/10 px-2 py-0.5 md:py-1 rounded shrink-0">{a.points} Pts</span>
                          </div>
                          <p className="text-xs md:text-sm text-white/50 mb-8 leading-relaxed italic">{a.instructions}</p>
                          <div className="flex items-center space-x-2 text-[8px] md:text-[10px] text-white/30 mb-8 uppercase font-bold">
                            <Clock size={12} />
                            <span>Deadline: {format(new Date(a.dueDate), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                        
                        {submission ? (
                          <SubmissionStatus submission={submission} points={a.points} dark />
                        ) : (
                          <AssignmentSubmitter assignment={a} onSubmit={async (content) => {
                            await submitAssignment({
                              assignmentId: a.id,
                              studentId: user?.uid || '',
                              studentName: user?.displayName || 'Unknown',
                              content
                            });
                          }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="space-y-12 md:space-y-20">
              {UNITS.map(unit => (
                <section key={unit.id} className="space-y-6">
                  <div className="flex items-baseline space-x-4">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900">{unit.title}</h3>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0">{unit.term}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {unit.lessonIds.map(id => {
                      const lesson = LESSONS.find(l => l.id === id);
                      if (!lesson) return null;
                      return (
                        <div 
                          key={id} 
                          onClick={() => setSelectedLesson(lesson)}
                          className="dashboard-card group cursor-pointer p-6"
                        >
                          <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors shrink-0">
                              <Book size={20} />
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-brand-600 transition-transform group-hover:translate-x-1 shrink-0 ml-2" />
                          </div>
                          <h4 className="font-serif text-base md:text-lg font-bold text-slate-900 mb-2 truncate">{lesson.title}</h4>
                          <p className="text-xs md:text-sm text-slate-500 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4 italic">{lesson.discussionText.substring(0, 100)}...</p>
                          <div className="flex flex-wrap gap-2">
                            {lesson.vocabulary.slice(0, 3).map(v => (
                              <span key={v} className="text-[8px] md:text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded lowercase">{v}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div 
            key="resources"
            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {resources.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 italic">No resources added to the library yet.</div>
            ) : (
              resources.map(res => (
                <div key={res.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-1">
                  <div>
                    <div className="p-3 bg-brand-50 rounded-2xl text-brand-600 w-fit mb-4">
                      {res.type === 'video' ? <Video size={20} /> : res.type === 'pdf' ? <FileText size={20} /> : <Link size={20} />}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">{res.title}</h3>
                    <p className="text-sm text-slate-500 italic mb-6 leading-relaxed line-clamp-3">{res.description}</p>
                  </div>
                  <a 
                    href={res.url} target="_blank" rel="noreferrer" 
                    className="flex items-center justify-between bg-slate-900 text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-brand-600 transition-colors"
                  >
                    Explore Content
                    <ChevronRight size={14} />
                  </a>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'grades' && (
          <motion.div 
            key="grades"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
          >
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h3 className="text-xl font-serif font-bold text-slate-900 italic">Academic Performance</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {submissions.length === 0 ? (
                <div className="p-12 text-center text-slate-400 italic">You haven't submitted any assignments yet.</div>
              ) : (
                submissions.map(sub => {
                  const assignment = assignments.find(a => a.id === sub.assignmentId);
                  return (
                    <div key={sub.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-all">
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900">{assignment?.title || sub.studentName + "'s Activity"}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 uppercase font-bold">
                            <Clock size={12} />
                            <span>Submitted: {format(new Date(sub.timestamp), 'MMM d, h:mm a')}</span>
                          </div>
                          {sub.gradedAt && (
                            <div className="flex items-center space-x-2 text-[10px] text-emerald-500 uppercase font-bold">
                              <Star size={12} />
                              <span>Graded: {format(new Date(sub.gradedAt), 'MMM d, h:mm a')}</span>
                            </div>
                          )}
                          {sub.returnedAt && (
                            <div className="flex items-center space-x-2 text-[10px] text-amber-500 uppercase font-bold">
                              <Clock size={12} />
                              <span>Returned: {format(new Date(sub.returnedAt), 'MMM d, h:mm a')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        {sub.status === 'graded' ? (
                          <>
                            <div className="text-right">
                              <div className="text-2xl font-black text-brand-900">{sub.score} <span className="text-[10px] text-slate-400">/ {assignment?.points}</span></div>
                              <div className="text-[10px] font-black uppercase text-emerald-600">Performance Index</div>
                            </div>
                            <div className="max-w-[200px] hidden md:block">
                              <p className="text-xs text-slate-500 italic">"{sub.feedback}"</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2 text-brand-600 bg-brand-50 px-4 py-2 rounded-xl">
                            <CheckCircle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">In Review</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div 
            key="leaderboard"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center space-x-3 mb-8">
              <Trophy className="text-accent-gold" size={24} />
              <h3 className="text-xl font-serif font-bold text-slate-900 italic">Class Academic Rankings</h3>
            </div>
            <div className="space-y-4">
              {sortedStudents.map((s, i) => (
                <div 
                  key={s.uid} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    s.uid === user?.uid ? 'bg-brand-50 border-2 border-brand-100' : 'bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 flex items-center justify-center font-black text-xs rounded-full ${
                      i === 0 ? 'bg-accent-gold text-white' : 
                      i === 1 ? 'bg-slate-300 text-white' : 
                      i === 2 ? 'bg-orange-300 text-white' : 'text-slate-400'
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {s.displayName}
                        {s.uid === user?.uid && <span className="text-[8px] bg-brand-600 text-white px-1.5 py-0.5 rounded uppercase font-black tracking-widest">You</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-widest">Learner</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-brand-900">{s.totalPoints || 0}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Pts</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'journal' && (
          <motion.div 
            key="journal"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-1">
              <JournalCreator onSubmit={addNote} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-serif font-bold text-slate-900 italic mb-4">Literary Reflections</h3>
              {notes.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center italic text-slate-400">
                  <StickyNote size={40} className="mx-auto mb-4 opacity-20" />
                  Your private thoughts on literature will appear here.
                </div>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group">
                    <button 
                      onClick={async () => {
                        if (confirm("Are you sure you want to remove this reflection?")) {
                          try {
                            await deleteNote(note.id);
                            alert("🗑️ Entry removed from your log.");
                          } catch (e) {
                            alert("❌ Error: Failed to remove entry.");
                          }
                        }
                      }}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 className="font-serif font-bold text-slate-900 text-lg mb-2">{note.title}</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed italic mb-4">"{note.content}"</p>
                    <div className="text-[10px] font-black uppercase text-slate-300">{format(new Date(note.createdAt), 'MMMM d, yyyy')}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto w-full"
          >
            <ProfileEditor profile={profile} onUpdate={updateProfile} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const JournalCreator: React.FC<{ onSubmit: (n: any) => Promise<void> }> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    try {
      await onSubmit({ title, content });
      alert("📔 Journal entry saved: Your reflection has been documented in your scholarly log.");
      setTitle(''); setContent('');
    } catch (e) {
      alert("❌ Error: Failed to save the entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <StickyNote className="text-brand-600" size={20} />
        <h3 className="text-lg font-serif font-bold text-slate-900 italic">New Entry</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Entry Title</label>
          <input 
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic"
            placeholder="Reflection on Sonnet 18"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400">Your Thoughts</label>
          <textarea 
            value={content} onChange={e => setContent(e.target.value)}
            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm italic font-serif leading-relaxed"
            placeholder="Write freely..."
          />
        </div>
        <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl flex items-center justify-center space-x-2 font-bold hover:shadow-lg transition-all">
          <Save size={16} />
          <span>{loading ? 'Saving...' : 'Record Reflection'}</span>
        </button>
      </form>
    </div>
  );
};

const ProfileEditor: React.FC<{ profile: any; onUpdate: (d: any) => Promise<void> }> = ({ profile, onUpdate }) => {
  const [bio, setBio] = useState(profile?.bio || '');
  const [goal, setGoal] = useState(profile?.learningGoal || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate({ bio, learningGoal: goal });
      alert("👤 Profile updated: Your academic identity has been successfully refreshed.");
    } catch (e) {
      alert("❌ Error: Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-brand-50 rounded-full mx-auto flex items-center justify-center text-brand-600 mb-4 border-4 border-white shadow-xl">
          <User size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 italic">{profile?.displayName}</h3>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{profile?.email}</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
            <MessageCircle size={12} className="mr-2" />
            Scholar's Introduction (Bio)
          </label>
          <textarea 
            value={bio} onChange={e => setBio(e.target.value)}
            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm italic font-serif leading-relaxed focus:ring-2 focus:ring-brand-600 transition-all"
            placeholder="Briefly describe your scholarly interests..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center">
            <TrendingUp size={12} className="mr-2" />
            Learning Objective
          </label>
          <input 
            value={goal} onChange={e => setGoal(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm italic"
            placeholder="e.g. Master the art of the critical essay"
          />
        </div>
        <button 
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-brand-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-100"
        >
          <Save size={18} />
          <span>{loading ? 'Committing Changes...' : 'Synchronize Profile'}</span>
        </button>
      </div>

      <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-black text-brand-900">{profile?.badges?.length || 0}</div>
          <div className="text-[8px] font-black uppercase text-slate-400">Accomplishments</div>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-2xl">
          <div className="text-2xl font-black text-brand-900">{profile?.totalPoints || 0}</div>
          <div className="text-[8px] font-black uppercase text-slate-400">Scholarship Credits</div>
        </div>
      </div>
    </div>
  );
};

const SubmissionStatus: React.FC<{ submission: any; points: number; dark?: boolean }> = ({ submission, points, dark }) => (
  <div className={`rounded-xl p-4 border ${dark ? 'bg-white/10 border-white/5' : 'bg-brand-50 border-brand-100'}`}>
    <div className={`flex items-center space-x-2 mb-1 ${dark ? 'text-accent-gold' : 'text-brand-600'}`}>
      {submission.status === 'returned' ? <AlertTriangle size={14} className="text-rose-400" /> : <CheckCircle size={14} />}
      <span className={`text-[10px] font-black uppercase tracking-widest ${submission.status === 'returned' ? 'text-rose-400' : ''}`}>
        {submission.status === 'graded' ? 'Graded' : submission.status === 'returned' ? 'Returned for Revision' : 'Submitted'}
      </span>
    </div>
    {submission.status !== 'pending' && (
      <div className="mt-2">
        {submission.status === 'graded' && (
          <div className={`text-lg font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Score: {submission.score} / {points}
          </div>
        )}
        <p className={`text-[10px] italic ${dark ? 'text-white/40' : 'text-slate-500'}`}>
          "{submission.feedback}"
        </p>
      </div>
    )}
    {typeof submission.content === 'object' && (
      <div className={`mt-4 pt-4 border-t ${dark ? 'border-white/10' : 'border-brand-200'} space-y-2`}>
        <div className={`text-[8px] font-black uppercase tracking-tighter ${dark ? 'text-white/40' : 'text-slate-400'}`}>Evaluation Summary</div>
        {Object.entries(submission.content as Record<string, string>).map(([key, val], idx) => (
          <div key={key} className="flex justify-between items-center text-[9px]">
            <span className={dark ? 'text-white/60' : 'text-slate-500'}>Q{idx+1}</span>
            <span className={`font-bold ${dark ? 'text-accent-gold' : 'text-brand-700'} truncate ml-2 max-w-[150px]`}>{val}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AssignmentSubmitter: React.FC<{ assignment: Assignment; onSubmit: (c: any) => Promise<void> }> = ({ assignment, onSubmit }) => {
  const [content, setContent] = useState<string | Record<string, string>>(assignment.questions ? {} : '');
  const [submitting, setSubmitting] = useState(false);

  const handleQuizChange = (questionId: string, value: string) => {
    setContent(prev => ({
      ...(prev as Record<string, string>),
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (typeof content === 'string' && !content.trim()) return;
    if (typeof content === 'object' && Object.keys(content).length === 0) return;
    
    setSubmitting(true);
    try {
      await onSubmit(content);
      alert("🚀 Submission received: Your work has been successfully filed for review.");
    } catch (e) {
      alert("❌ Error: Failed to send submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (assignment.questions) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-8">
          {assignment.questions.map((q, idx) => (
            <div key={q.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-accent-gold text-slate-900 flex items-center justify-center text-[10px] font-black shrink-0">{idx + 1}</span>
                <p className="text-sm text-white/90 font-medium">{q.text}</p>
              </div>
              
              {q.type === 'multiple-choice' && (
                <div className="grid grid-cols-1 gap-2 pl-9">
                  {q.options?.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleQuizChange(q.id, opt)}
                      className={`text-left px-4 py-3 rounded-xl border text-xs transition-all ${
                        (content as Record<string, string>)[q.id] === opt
                          ? 'bg-accent-gold text-slate-900 border-accent-gold shadow-lg shadow-accent-gold/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {q.type === 'short-answer' && (
                <div className="pl-9">
                  <input
                    value={(content as Record<string, string>)[q.id] || ''}
                    onChange={(e) => handleQuizChange(q.id, e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={submitting}
          className="w-full bg-accent-gold text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center space-x-2 hover:shadow-xl transition-all mt-8"
        >
          <Send size={16} />
          <span>{submitting ? 'Submitting Answers...' : 'Submit Evaluation'}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <textarea
        value={content as string}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your literary analysis here..."
        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
      />
      <button 
        onClick={handleSubmit} 
        disabled={submitting}
        className="w-full bg-accent-gold text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
      >
        <Send size={16} />
        <span>{submitting ? 'Transmitting...' : 'Turn In Work'}</span>
      </button>
    </div>
  );
}
