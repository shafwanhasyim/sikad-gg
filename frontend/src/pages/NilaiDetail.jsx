import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import nilaiService from "../services/nilaiService";

const NilaiDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nilai, setNilai] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchNilaiData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          setError("Invalid grade ID. Please check the URL and try again.");
          setLoading(false);
          return;
        }
        
        const data = await nilaiService.getNilai(id);
        
        if (!data) {
          setError("Grade not found. It may have been deleted or does not exist.");
          setLoading(false);
          return;
        }
        
        setNilai(data);
      } catch (err) {
        console.error("Error fetching nilai details:", err);
        setError(`Failed to load grade details: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNilaiData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this grade?")) {
      return;
    }
    
    try {
      await nilaiService.deleteNilai(id);
      navigate("/nilai");
    } catch (err) {
      console.error("Error deleting nilai:", err);
      alert("Failed to delete nilai. Please try again later.");
    }
  };

  if (loading) {
    return <LoadingIndicator message="Loading nilai details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!nilai) {
    return <ErrorMessage message="Nilai not found" />;
  }

  // Get grade letter based on nilai
  const getGradeLetter = (score) => {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Nilai Detail</h1>
        <div className="space-x-2">
          <Link
            to={`/nilai/edit/${id}`}
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

      {/* Nilai Info Card */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Grade Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Student</h3>
            {nilai.mahasiswa && typeof nilai.mahasiswa === 'object' ? (
              <div>
                <p className="mt-1 text-lg font-medium text-gray-900">{nilai.mahasiswa.name}</p>
                <p className="text-sm text-gray-500">NPM: {nilai.mahasiswa.npm}</p>
                <p className="text-sm text-gray-500">Major: {nilai.mahasiswa.jurusan}</p>
                <Link to={`/mahasiswa/${nilai.mahasiswa._id}`} className="text-blue-500 hover:underline text-sm">
                  View Student Profile
                </Link>
              </div>
            ) : (
              <p className="mt-1 text-gray-600">Student information not available</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Course</h3>
            {nilai.mataKuliah && typeof nilai.mataKuliah === 'object' ? (
              <div>
                <p className="mt-1 text-lg font-medium text-gray-900">{nilai.mataKuliah.nama}</p>
                <p className="text-sm text-gray-500">Code: {nilai.mataKuliah.kode}</p>
                <p className="text-sm text-gray-500">Credits: {nilai.mataKuliah.sks} SKS</p>
                <Link to={`/matakuliah/${nilai.mataKuliah._id}`} className="text-blue-500 hover:underline text-sm">
                  View Course Details
                </Link>
              </div>
            ) : (
              <p className="mt-1 text-gray-600">Course information not available</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Semester</h3>
              <p className="mt-1 text-lg text-gray-900">{nilai.semester}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Score</h3>
              <p className="mt-1 text-3xl font-bold text-blue-600">{nilai.nilai}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Grade</h3>
              <div className={`
                mt-1 text-3xl font-bold rounded-full w-12 h-12 flex items-center justify-center
                ${nilai.nilai >= 85 ? 'bg-green-100 text-green-600' : 
                  nilai.nilai >= 70 ? 'bg-blue-100 text-blue-600' : 
                  nilai.nilai >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                  'bg-red-100 text-red-600'}
              `}>
                {getGradeLetter(nilai.nilai)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to="/nilai"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
};

export default NilaiDetail;
