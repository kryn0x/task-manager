/**
 * Format a date string to a readable format
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Check if a task is overdue
 */
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
};

/**
 * Extract error message from axios error
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors?.length) {
    return error.response.data.errors.map((e) => e.message || e).join(', ');
  }
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};
