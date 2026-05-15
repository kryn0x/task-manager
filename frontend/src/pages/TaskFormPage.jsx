import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../utils/helpers';

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: '',
    assigned_to: '',
    project_id: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  // Load projects, users, and task data (if editing)
  useEffect(() => {
    const init = async () => {
      try {
        const [projectsRes, usersRes] = await Promise.all([
          projectService.getAll(),
          authService.getUsers(),
        ]);
        setProjects(projectsRes.data.projects);
        setUsers(usersRes.data.users);

        if (isEdit) {
          const { data } = await taskService.getById(id);
          const t = data.task;
          setForm({
            title: t.title,
            description: t.description || '',
            status: t.status,
            priority: t.priority,
            due_date: t.due_date || '',
            assigned_to: t.assigned_to || '',
            project_id: t.project_id,
          });
        }
      } catch {
        toast.error('Failed to load form data');
        navigate('/tasks');
      } finally {
        setFetching(false);
      }
    };
    init();
  }, [id, isEdit, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 2) errs.title = 'Title must be at least 2 characters';
    if (!form.project_id) errs.project_id = 'Project is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const payload = {
        ...form,
        assigned_to: form.assigned_to || null,
        due_date: form.due_date || null,
        project_id: Number(form.project_id),
      };

      if (isEdit) {
        await taskService.update(id, payload);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(payload);
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEdit ? 'Update task details' : 'Fill in the details to create a new task'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Design homepage mockup"
              className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the task in detail..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              name="project_id"
              value={form.project_id}
              onChange={handleChange}
              className={`input-field ${errors.project_id ? 'border-red-400 focus:ring-red-400' : ''}`}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>}
          </div>

          {/* Assign to */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign To</label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          {/* Status & Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEdit ? 'Saving...' : 'Creating...'}
                </span>
              ) : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;
