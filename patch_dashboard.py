import os

target_file = 'src/components/TeacherDashboard.tsx'
with open(target_file, 'r') as f:
    lines = f.readlines()

new_content = """
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
                              if (confirm(`Are you sure you want to remove "${a.title}"? Students will no longer see this task, but their saved scores will remain in their archive.`)) {
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
"""

# Insert after the line containing <BroadcastCreator onSubmit={postBroadcast} /> and its closing motion.div
for i, line in enumerate(lines):
    if '<BroadcastCreator onSubmit={postBroadcast} />' in line:
        # The next line should be the closing motion.div
        if '        </motion.div>' in lines[i+1] or '      </motion.div>' in lines[i+1] or '</motion.div>' in lines[i+1]:
            lines.insert(i+2, new_content)
            break

with open(target_file, 'w') as f:
    f.writelines(lines)
