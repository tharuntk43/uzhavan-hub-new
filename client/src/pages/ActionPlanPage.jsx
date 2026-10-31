import { Icon } from '../components/icons/LucideIcons.jsx';
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function ActionPlanPage() {
  const { user, activePlot, plots } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [templateSchedule, setTemplateSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [activePlot]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.getFarmTasks(activePlot?.id);
      if (res.tasks && res.tasks.length > 0) {
        setTasks(res.tasks);
        setProgress(res.progressPercentage || 0);
      } else if (res.schedule) {
        setTemplateSchedule(res.schedule);
        // Flatten template tasks for interactive tracking
        const flat = [];
        res.schedule.stages?.forEach(stage => {
          stage.tasks?.forEach((t, idx) => {
            flat.push({
              id: `${stage.week}_${idx}`,
              week_number: stage.week,
              stage_name: stage.stageName,
              task_description: t.task,
              category: t.category,
              is_mandatory: t.mandatory ? 1 : 0,
              is_completed: false
            });
          });
        });
        setTasks(flat);
        const comp = flat.filter(t => t.is_completed).length;
        setProgress(Math.round((comp / flat.length) * 100));
      }
    } catch (err) {
      console.error('Failed to load action plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task) => {
    const nextState = !task.is_completed;
    const updated = tasks.map(t => t.id === task.id ? { ...t, is_completed: nextState } : t);
    setTasks(updated);

    const comp = updated.filter(t => t.is_completed).length;
    setProgress(Math.round((comp / updated.length) * 100));

    // Persist if numeric or uuid ID
    if (task.id && typeof task.id === 'string' && (task.id.startsWith('tsk_') || task.id.length > 10)) {
      try {
        await api.toggleFarmTask(task.id, nextState);
      } catch (err) {
        console.error('Task update failed', err);
      }
    }
  };

  // Group by week/stage
  const groupedTasks = tasks.reduce((acc, t) => {
    const key = `Week ${t.week_number}: ${t.stage_name || 'Field Operation'}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#003b1b] to-[#14532d] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Icon name="calendar_month" className="text-sm" />
            Phenology-Linked Cultivation Roadmap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Weekly Farm Action Plan & Crop Calendar
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-tamil">
            பயிர் கால வாரியான செயல் திட்டங்கள், உரம் இடுதல் மற்றும் அறுவடை சரிபார்ப்பு பட்டியல்
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-center min-w-[160px]">
          <div className="text-[11px] text-emerald-200 uppercase font-semibold">Active Plot</div>
          <div className="font-bold text-base text-white">{activePlot?.plot_name || 'Main Field'}</div>
          <div className="text-xs text-stone-300 font-medium">{activePlot?.current_crop || 'Samba Paddy'}</div>
        </div>
      </div>

      {/* Season Progress Overview */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="w-full sm:w-2/3 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-stone-700 uppercase tracking-wider">Season Execution Progress</span>
            <span className="font-black text-[#14532d] text-base">{progress}%</span>
          </div>
          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-600 to-[#14532d] rounded-full transition-all duration-500"
            />
          </div>
          <div className="text-[11px] text-stone-500 flex justify-between">
            <span>{tasks.filter(t => t.is_completed).length} of {tasks.length} operations completed</span>
            <span>Est. Harvest: 45 Days remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200 min-w-[100px]">
            <div className="text-2xl font-black text-[#14532d]">{tasks.filter(t => t.is_completed).length}</div>
            <div className="text-[10px] uppercase font-bold text-emerald-800">Done</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200 min-w-[100px]">
            <div className="text-2xl font-black text-amber-800">{tasks.filter(t => !t.is_completed).length}</div>
            <div className="text-[10px] uppercase font-bold text-amber-900">Pending</div>
          </div>
        </div>
      </div>

      {/* Task Checklist Accordions / Groups */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
          <Icon name="progress_activity" className="animate-spin text-3xl text-[#14532d]" />
          <p className="text-sm font-medium">Loading weekly agricultural operations...</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(groupedTasks).map(([groupTitle, groupTasks], idx) => {
            const groupDone = groupTasks.filter(t => t.is_completed).length === groupTasks.length;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all ${
                  groupDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-200'
                } p-5 shadow-sm`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Icon name={groupDone ? 'check_circle' : 'award'} className={`text-lg ${groupDone ? 'text-emerald-600' : 'text-[#14532d]'}`} />
                    <h3 className="font-bold text-stone-900 text-sm">{groupTitle}</h3>
                  </div>
                  <span className="text-xs text-stone-400 font-semibold">
                    {groupTasks.filter(t => t.is_completed).length} / {groupTasks.length} Done
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {groupTasks.map((task) => (
                    <label
                      key={task.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                        task.is_completed
                          ? 'bg-emerald-50/50 border-emerald-100 text-stone-400'
                          : 'bg-white border-stone-100 hover:border-stone-300 text-stone-800 shadow-sm'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!task.is_completed}
                        onChange={() => handleToggle(task)}
                        className="mt-0.5 rounded text-[#14532d] focus:ring-[#14532d] h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className={`text-xs font-semibold ${task.is_completed ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {task.task_description}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {task.category && (
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">
                              {task.category}
                            </span>
                          )}
                          {task.is_mandatory ? (
                            <span className="text-[10px] text-amber-700 font-bold">Critical Operation</span>
                          ) : null}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
