import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, isOverdue } from '../utils/helpers';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { isAdmin, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = isAdmin
          ? await dashboardService.getAdminDashboard()
          : await dashboardService.getMemberDashboard();
        setData(res.data);
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [isAdmin]);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (!data) return null;

  const { stats, recentTasks } = data;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold">Good day, {user?.name}! 👋</h2>
        <p className="text-blue-100 mt-1 text-sm">
          {isAdmin ? 'Here\'s an overview of your team\'s progress.' : 'Here\'s a summary of your tasks.'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              color="indigo"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            />
            <StatCard
              title="Total Projects"
              value={stats.totalProjects}
              color="blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            <StatCard
              title="Total Tasks"
              value={stats.totalTasks}
              color="purple"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <StatCard
              title="Completed"
              value={stats.completedTasks}
              color="green"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Pending"
              value={stats.pendingTasks}
              color="yellow"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTasks}
              color="blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard
              title="Overdue"
              value={stats.overdueTasks}
              color="red"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Assigned Tasks"
              value={stats.totalAssigned}
              color="blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            />
            <StatCard
              title="Completed"
              value={stats.completedTasks}
              color="green"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Pending"
              value={stats.pendingTasks}
              color="yellow"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="In Progress"
              value={stats.inProgressTasks}
              color="blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            <StatCard
              title="Overdue"
              value={stats.overdueTasks}
              color="red"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
            />
          </>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Tasks</h3>
        {recentTasks?.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No tasks yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Task</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium hidden md:table-cell">Project</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium hidden sm:table-cell">Priority</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium hidden lg:table-cell">Due Date</th>
                  {isAdmin && <th className="text-left py-3 px-2 text-gray-500 font-medium hidden lg:table-cell">Assignee</th>}
                </tr>
              </thead>
              <tbody>
                {recentTasks?.map((task) => (
                  <tr
                    key={task.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      isOverdue(task.due_date, task.status) ? 'bg-red-50/50' : ''
                    }`}
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {isOverdue(task.due_date, task.status) && (
                          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" title="Overdue" />
                        )}
                        <span className="font-medium text-gray-900 truncate max-w-[180px]">{task.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-500 hidden md:table-cell">{task.project?.title || '—'}</td>
                    <td className="py-3 px-2"><StatusBadge status={task.status} /></td>
                    <td className="py-3 px-2 hidden sm:table-cell"><PriorityBadge priority={task.priority} /></td>
                    <td className="py-3 px-2 text-gray-500 hidden lg:table-cell">
                      <span className={isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}>
                        {formatDate(task.due_date)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-2 text-gray-500 hidden lg:table-cell">
                        {task.assignee?.name || 'Unassigned'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
