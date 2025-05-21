import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import TableDynamic from "../components/TableDynamic";
import mataKuliahService from "../services/mataKuliahService";
import nilaiService from "../services/nilaiService";

const MataKuliahDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mataKuliah, setMataKuliah] = useState(null);
  const [nilai, setNilai] = useState([]);
  const [distribusi, setDistribusi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nilaiColumns, setNilaiColumns] = useState([]);
  useEffect(() => {
    const fetchMataKuliahData = async () => {
      try {
        setLoading(true);
        const [mataKuliahData, nilaiData, distribusiData] = await Promise.all([
          mataKuliahService.getMataKuliah(id).catch(err => {
            console.error("Error fetching mata kuliah data:", err);
            return null;
          }),
          nilaiService.getNilaiByMataKuliah(id).catch(err => {
            console.error("Error fetching mata kuliah nilai:", err);
            return [];
          }),
          nilaiService.getDistribusi(id).catch(err => {
            console.error("Error fetching mata kuliah distribution:", err);
            return {};
          })
        ]);
        
        if (!mataKuliahData) {
          setError("Failed to load course data. The course may not exist or there was a server error.");
          setLoading(false);
          return;
        }
        
        setMataKuliah(mataKuliahData);
        setNilai(Array.isArray(nilaiData) ? nilaiData : []);
        setDistribusi(distribusiData);
        
        // Dynamically create columns for nilai table
        if (nilaiData && nilaiData.length > 0) {
          // Filter out unwanted properties and create columns
          const excludedFields = ['_id', '__v', 'mataKuliah', 'createdAt', 'updatedAt'];
          
          const dynamicColumns = Object.keys(nilaiData[0])
            .filter(key => !excludedFields.includes(key))
            .map(key => {
              if (key === 'mahasiswa' && typeof nilaiData[0][key] === 'object') {
                return {
                  key,
                  label: 'Mahasiswa',
                  render: (row) => row.mahasiswa?.name || 'N/A'
                };
              }
              return {
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
              };
            });
          
          setNilaiColumns(dynamicColumns);
        }
      } catch (err) {
        console.error("Error fetching mata kuliah details:", err);
        setError("Failed to load mata kuliah details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMataKuliahData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${mataKuliah.nama}?`)) {
      return;
    }
    
    try {
      await mataKuliahService.deleteMataKuliah(id);
      navigate("/matakuliah");
    } catch (err) {
      console.error("Error deleting mata kuliah:", err);
      alert("Failed to delete mata kuliah. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading mata kuliah details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!mataKuliah) {
    return <ErrorMessage message="Mata kuliah not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mata Kuliah Detail</h1>
        <div className="space-x-2">
          <Link
            to={`/matakuliah/edit/${id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Mata Kuliah Info Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Course Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(mataKuliah)
            .filter(([key]) => !['_id', '__v'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p className="mt-1 text-lg text-gray-900">{value}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Grade Distribution */}
      {distribusi && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">A (≥ 85)</h3>
              <p className="mt-1 text-3xl font-bold text-green-600">
                {distribusi.A || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">B (70-84)</h3>
              <p className="mt-1 text-3xl font-bold text-blue-600">
                {distribusi.B || 0}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">C (60-69)</h3>
              <p className="mt-1 text-3xl font-bold text-yellow-600">
                {distribusi.C || 0}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <h3 className="text-sm font-medium text-gray-500">D (≤ 59)</h3>
              <p className="mt-1 text-3xl font-bold text-red-600">
                {distribusi.D || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Total Students</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {nilai.length} students enrolled
            </p>
          </div>
        </div>
      )}

      {/* Nilai Table */}
      <TableDynamic
        data={nilai}
        columns={nilaiColumns}
        title="Student Grades"
        emptyMessage="No grades recorded for this course."
      />

      <div className="flex justify-end">
        <Link
          to="/matakuliah"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default MataKuliahDetail;
