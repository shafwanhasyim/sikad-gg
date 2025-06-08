import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import nilaiService from "../services/nilaiService";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const data = await nilaiService.getRanking();
        setRanking(data);

        console.log("Ranking data fetched:", data);
      } catch (err) {
        console.error("Error fetching ranking:", err);
        setError("Failed to load ranking data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Loading ranking data..." />;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Ranking</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-lg font-semibold text-blue-800">
            Academic Performance Ranking
          </h2>
          <p className="text-sm text-blue-600">
            Based on overall grade point average across all courses
          </p>
        </div>

        {ranking.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No ranking data available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jurusan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ranking.map((student, index) => (
                  <tr
                    key={student?._id || index}
                    className={index < 3 ? "bg-yellow-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index < 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-200 text-yellow-800 font-bold">
                          {index + 1}
                        </span>
                      ) : (
                        <span className="text-gray-500">{index + 1}</span>
                      )}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student?.npm || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student?.nama || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student?.jurusan || "N/A"}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                        ${
                          student?.rataRata >= 3.5
                            ? "bg-green-100 text-green-800"
                            : student?.rataRata >= 3.0
                            ? "bg-blue-100 text-blue-800"
                            : student?.rataRata >= 2.5
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student?.rataRata?.toFixed(2) || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student?.totalMataKuliah || "N/A"}
                    </td>{" "}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/student/${student?._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ranking;
