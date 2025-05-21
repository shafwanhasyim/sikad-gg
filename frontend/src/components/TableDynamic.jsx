import { useState } from "react";

const TableDynamic = ({
  data,
  columns,
  isLoading,
  error,
  onEdit,
  onDelete,
  onView,
  title,
  emptyMessage = "No data available"
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    
    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr 
                key={row._id || rowIndex} 
                className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >                {columns.map((column) => (
                  <td key={`${row._id || rowIndex}-${column.key}`} className="px-4 py-2 border-b">
                    {column.render 
                      ? column.render(row) 
                      : column.key.includes('.') 
                        ? column.key.split('.').reduce((obj, key) => obj && obj[key], row) ?? 'N/A'
                        : row[column.key] ?? 'N/A'}
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <div className="flex space-x-2">
                    {onView && (
                      <button 
                        onClick={() => onView(row)} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        onClick={() => onEdit(row)} 
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={() => onDelete(row)} 
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDynamic;
