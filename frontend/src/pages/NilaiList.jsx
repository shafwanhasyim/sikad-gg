import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TableDynamic from "../components/TableDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import nilaiService from "../services/nilaiService";

const NilaiList = () => {
  const navigate = useNavigate();
  const [nilai, setNilai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchNilai = async () => {
      try {
        setLoading(true);
        const data = await nilaiService.getAllNilai();
        setNilai(data);
        
        // Dynamically create columns based on the first item's structure
        if (data && data.length > 0) {
          const sampleData = data[0];
          // Filter out unwanted properties and create columns
          const excludedFields = ['_id', '__v', 'createdAt', 'updatedAt'];
          
          const dynamicColumns = Object.keys(sampleData)
            .filter(key => !excludedFields.includes(key))
            .map(key => {
              if (key === 'mahasiswa' && typeof sampleData[key] === 'object') {
                return {
                  key,
                  label: 'Mahasiswa',
                  render: (row) => row.mahasiswa?.name || 'N/A'
                };
              }
              if (key === 'mataKuliah' && typeof sampleData[key] === 'object') {
                return {
                  key,
                  label: 'Mata Kuliah',
                  render: (row) => row.mataKuliah?.nama || 'N/A'
                };
              }
              return {
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
              };
            });
          
          setColumns(dynamicColumns);
        }
      } catch (err) {
        console.error("Error fetching nilai:", err);
        setError("Failed to load nilai data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNilai();
  }, []);

  const handleDelete = async (nilai) => {
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }
    
    try {
      await nilaiService.deleteNilai(nilai._id);
      setNilai(prevNilai => prevNilai.filter(n => n._id !== nilai._id));
    } catch (err) {
      console.error("Error deleting nilai:", err);
      alert("Failed to delete nilai. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading nilai data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nilai</h1>
        <Link
          to="/grade/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Nilai
        </Link>
      </div>

      {nilai.length === 0 && !loading && !error ? (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-yellow-700">No grade records found. Click the "Add New Nilai" button to create one.</p>
        </div>
      ) : (
        <TableDynamic
          data={nilai}
          columns={columns}
          title="Nilai List"
          onEdit={(row) => navigate(`/grade/edit/${row._id}`)}
          onDelete={handleDelete}
          onView={(row) => navigate(`/grade/${row._id}`)}
          emptyMessage="No nilai records found."
        />
      )}
    </div>
  );};

export default NilaiList;
