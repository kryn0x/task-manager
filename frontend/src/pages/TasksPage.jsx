import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { formatDate, isOverdue } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High'];

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState({ open: false, task: null });
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchTasks = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;
      const { data } = await taskService.getAll(params);
      setTasks(data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [statusFilter, priorityFilter]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskService.delete(deleteModal.task.id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t.id !== deleteModal.task.id));
      setDeleteModal({ open: false, task: null });
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatus(taskId);
    try {
      const { data } = await taskService.updateStatus(taskId, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading tasks..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <Link to="/tasks/new" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card py-4">
        <div className="flex flex-wrap gap-4">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Status:</label>
            <div className="flex gap-1">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">Priority:</label>
            <div className="flex gap-1">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    priorityFilter === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tasks table */}
      {tasks.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-gray-600 font-medium">No tasks found</h3>
          <p className="text-gray-400 text-sm mt-1">
            {statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'Try adjusting your filters'
              : isAdmin ? 'Create your first task to get started' : 'No tasks assigned to you yet'}
          </p>
          {isAdmin && statusFilter === 'All' && priorityFilter === 'All' && (
            <Link to="/tasks/new" className="btn-primary inline-flex mt-4">Create Task</Link>
          )}
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Task</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden md:table-cell">Project</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Due Date</th>
                  {isAdmin && <th className="text-left py-3 px-4 text-gray-500 font-medium hidden lg:table-cell">Assignee</th>}
                  <th className="text-right py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const overdue = isOverdue(task.due_date, task.status);
                  return (
                    <tr
                      key={task.id}
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50/40' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {overdue && (
                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" title="Overdue" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-gray-400 truncate max-w-[200px]">{task.description}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                        {task.project?.title || '—'}
                      </td>
                      <td className="py-3 px-4">
                        {/* Inline status update */}
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          disabled={updatingStatus === task.id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <PriorityBadge priority={task.priority} />
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <span className={overdue ? 'text-red-600 font-medium text-xs' : 'text-gray-500 text-xs'}>
                          {formatDate(task.due_date)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
                          {task.assignee?.name || 'Unassigned'}
                        </td>
                      )}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => navigate(`/tasks/${task.id}/edit`)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleteModal({ open: true, task })}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteModal.task?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, task: null })}
        loading={deleting}
      />
    </div>
  );
};

export default TasksPage;
