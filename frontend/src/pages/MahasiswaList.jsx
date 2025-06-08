import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TableDynamic from "../components/TableDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import mahasiswaService from "../services/mahasiswaService";

const MahasiswaList = () => {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Check if there's a success message in the location state
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
    
    const fetchMahasiswa = async () => {
      try {
        setLoading(true);
        const data = await mahasiswaService.getAllMahasiswa();
        setMahasiswa(data);
        
        // Dynamically create columns based on the first item's structure
        if (data && data.length > 0) {
          const sampleData = data[0];
          const dynamicColumns = Object.keys(sampleData)
            .filter(key => key !== '_id' && key !== '__v') // Exclude non-display fields
            .map(key => ({
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
            }));
          
          setColumns(dynamicColumns);
        }
      } catch (err) {
        console.error("Error fetching mahasiswa:", err);
        setError("Failed to load mahasiswa data. Please try again later.");
      } finally {
        setLoading(false);
      }    };

    fetchMahasiswa();
  }, [location.state]);
  const handleDelete = async (mahasiswa) => {
    if (!window.confirm(`Are you sure you want to delete ${mahasiswa.name}?`)) {
      return;
    }
    
    try {
      await mahasiswaService.deleteMahasiswa(mahasiswa._id);
      setMahasiswa(prevMahasiswa => prevMahasiswa.filter(m => m._id !== mahasiswa._id));
      setSuccessMessage(`${mahasiswa.name} was successfully deleted.`);
    } catch (err) {
      console.error("Error deleting mahasiswa:", err);
      setError(`Failed to delete mahasiswa: ${err.message}`);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading mahasiswa data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mahasiswa</h1>
        <Link
          to="/student/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Mahasiswa
        </Link>
      </div>

      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onDismiss={() => setSuccessMessage("")}
        />
      )}

      {error && <ErrorMessage message={error} onRetry={() => {
        setError(null);
        window.location.reload();
      }} />}

      <TableDynamic
        data={mahasiswa}
        columns={columns}
        title="Mahasiswa List"
        onEdit={(row) => navigate(`/student/edit/${row._id}`)}
        onDelete={handleDelete}
        onView={(row) => navigate(`/student/${row._id}`)}
        emptyMessage="No mahasiswa records found."
      />
    </div>
  );
};

export default MahasiswaList;
