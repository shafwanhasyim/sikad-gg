import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import mahasiswaService from "../services/mahasiswaService";
import mataKuliahService from "../services/mataKuliahService";
import nilaiService from "../services/nilaiService";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

const Dashboard = () => {
  const [stats, setStats] = useState({
    mahasiswa: 0,
    mataKuliah: 0,
    nilai: 0
  });
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch count data
        const [mahasiswaRes, mataKuliahRes, nilaiRes, rankingRes] = await Promise.all([
          mahasiswaService.getAllMahasiswa().catch(err => {
            console.error("Error fetching mahasiswa data:", err);
            return [];
          }),
          mataKuliahService.getAllMataKuliah().catch(err => {
            console.error("Error fetching mataKuliah data:", err);
            return [];
          }),
          nilaiService.getAllNilai().catch(err => {
            console.error("Error fetching nilai data:", err);
            return [];
          }),
          nilaiService.getRanking().catch(err => {
            console.error("Error fetching ranking data:", err);
            return [];
          })
        ]);
        
        setStats({
          mahasiswa: Array.isArray(mahasiswaRes) ? mahasiswaRes.length : 0,
          mataKuliah: Array.isArray(mataKuliahRes) ? mataKuliahRes.length : 0,
          nilai: Array.isArray(nilaiRes) ? nilaiRes.length : 0
        });

        setRanking(Array.isArray(rankingRes) ? rankingRes : []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  if (loading) {
    return <LoadingIndicator message="Loading dashboard data..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={() => window.location.reload()} 
        title="Dashboard Error" 
      />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700">Mahasiswa</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.mahasiswa}</p>
          <Link to="/student" className="text-blue-500 hover:underline block mt-4">
            View Details →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700">Mata Kuliah</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.mataKuliah}</p>
          <Link to="/class" className="text-blue-500 hover:underline block mt-4">
            View Details →
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Nilai</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.nilai}</p>
          <Link to="/grade" className="text-blue-500 hover:underline block mt-4">
            View Details →
          </Link>        </div>
      </div>
        {/* Top Students */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Top Performing Students</h2>
        
        {!Array.isArray(ranking) || ranking.length === 0 ? (
          <p className="text-gray-500">No ranking data available yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ranking.slice(0, 5).map((student, index) => (
                  <tr key={student?.mahasiswa?._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.mahasiswa?.npm || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student?.mahasiswa?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student?.ip ? student.ip.toFixed(2) : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500 hover:text-blue-700">
                      {student?.mahasiswa?._id ? (
                        <Link to={`/student/${student.mahasiswa._id}`}>View Details</Link>
                      ) : (
                        <span className="text-gray-400">No Link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Link to="/ranking" className="text-blue-500 hover:underline block mt-4">
          View Full Ranking →
        </Link>
      </div>
      
      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/student/add" 
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex flex-col items-center text-center"
          >
            <div className="text-blue-500 font-semibold">Add New Student</div>
            <p className="text-gray-600 text-sm mt-1">Register a new student in the system</p>
          </Link>
          
          <Link 
            to="/class/add" 
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex flex-col items-center text-center"
          >
            <div className="text-green-500 font-semibold">Add New Course</div>
            <p className="text-gray-600 text-sm mt-1">Create a new course in the system</p>
          </Link>
          
          <Link 
            to="/grade/add" 
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg flex flex-col items-center text-center"
          >
            <div className="text-purple-500 font-semibold">Record New Grade</div>
            <p className="text-gray-600 text-sm mt-1">Add a new grade for a student</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
