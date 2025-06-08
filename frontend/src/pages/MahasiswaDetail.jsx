import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import TableDynamic from "../components/TableDynamic";
import mahasiswaService from "../services/mahasiswaService";
import nilaiService from "../services/nilaiService";

const MahasiswaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [nilai, setNilai] = useState([]);
  const [ipSemester, setIpSemester] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nilaiColumns, setNilaiColumns] = useState([]);
  useEffect(() => {
    const fetchMahasiswaData = async () => {
      try {
        setLoading(true);
        const [mahasiswaData, nilaiData, ipData] = await Promise.all([
          mahasiswaService.getMahasiswa(id).catch(err => {
            console.error("Error fetching mahasiswa data:", err);
            return null;
          }),
          nilaiService.getNilaiByMahasiswa(id).catch(err => {
            console.error("Error fetching mahasiswa nilai:", err);
            return [];
          }),
          nilaiService.getIpSemester(id).catch(err => {
            console.error("Error fetching mahasiswa IP:", err);
            return null;
          })
        ]);
        
        if (!mahasiswaData) {
          setError("Failed to load student data. The student may not exist or there was a server error.");
          setLoading(false);
          return;
        }
        
        setMahasiswa(mahasiswaData);
        setNilai(Array.isArray(nilaiData) ? nilaiData : []);
        setIpSemester(ipData);
        
        // Dynamically create columns for nilai table
        if (nilaiData && nilaiData.length > 0) {
          // Filter out unwanted properties and create columns
          const excludedFields = ['_id', '__v', 'mahasiswa', 'createdAt', 'updatedAt'];
          
          const dynamicColumns = Object.keys(nilaiData[0])
            .filter(key => !excludedFields.includes(key))
            .map(key => {
              if (key === 'mataKuliah' && typeof nilaiData[0][key] === 'object') {
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
          
          setNilaiColumns(dynamicColumns);
        }
      } catch (err) {
        console.error("Error fetching mahasiswa details:", err);
        setError("Failed to load mahasiswa details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMahasiswaData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${mahasiswa.name}?`)) {
      return;
    }
    
    try {
      await mahasiswaService.deleteMahasiswa(id);
      navigate("/student");
    } catch (err) {
      console.error("Error deleting mahasiswa:", err);
      alert("Failed to delete mahasiswa. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading mahasiswa details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!mahasiswa) {
    return <ErrorMessage message="Mahasiswa not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mahasiswa Detail</h1>
        <div className="space-x-2">
          <Link
            to={`/student/edit/${id}`}
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

      {/* Mahasiswa Info Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(mahasiswa)
            .filter(([key]) => !['_id', '__v'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p className="mt-1 text-lg text-gray-900">{value}</p>
              </div>
            ))}
        </div>
      </div>

      {/* IP Semester */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">IP Semester</h3>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {ipSemester ? ipSemester.toFixed(2) : 'N/A'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {nilai.length}
            </p>
          </div>
        </div>
      </div>

      {/* Nilai Table */}
      <TableDynamic
        data={nilai}
        columns={nilaiColumns}
        title="Student Grades"
        emptyMessage="No grades recorded for this student."
      />

      <div className="flex justify-end">
        <Link
          to="/student"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default MahasiswaDetail;
