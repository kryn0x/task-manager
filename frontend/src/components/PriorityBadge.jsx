/**
 * Colored badge for task priority
 */
const PriorityBadge = ({ priority }) => {
  const styles = {
    Low: 'bg-gray-100 text-gray-600',
    Medium: 'bg-orange-100 text-orange-700',
    High: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`badge ${styles[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
