import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import TableDynamic from "../components/TableDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import SuccessMessage from "../components/SuccessMessage";
import mataKuliahService from "../services/mataKuliahService";

const MataKuliahList = () => {
  const [mataKuliah, setMataKuliah] = useState([]);
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
    
    const fetchMataKuliah = async () => {
      try {
        setLoading(true);
        const data = await mataKuliahService.getAllMataKuliah();
        setMataKuliah(data);
        
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
        console.error("Error fetching mata kuliah:", err);
        setError("Failed to load mata kuliah data. Please try again later.");
      } finally {
        setLoading(false);
      }    };

    fetchMataKuliah();
  }, [location.state]);
  const handleDelete = async (mataKuliah) => {
    if (!window.confirm(`Are you sure you want to delete ${mataKuliah.nama}?`)) {
      return;
    }
    
    try {
      await mataKuliahService.deleteMataKuliah(mataKuliah._id);
      setMataKuliah(prevMataKuliah => prevMataKuliah.filter(m => m._id !== mataKuliah._id));
      setSuccessMessage(`${mataKuliah.nama} was successfully deleted.`);
    } catch (err) {
      console.error("Error deleting mata kuliah:", err);
      setError(`Failed to delete mata kuliah: ${err.message || 'Unknown error'}`);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading mata kuliah data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mata Kuliah</h1>
        <Link
          to="/class/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Mata Kuliah
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
        data={mataKuliah}
        columns={columns}
        title="Mata Kuliah List"
        onEdit={(row) => navigate(`/class/edit/${row._id}`)}
        onDelete={handleDelete}
        onView={(row) => navigate(`/class/${row._id}`)}
        emptyMessage="No mata kuliah records found."
      />
    </div>
  );
};

export default MataKuliahList;
