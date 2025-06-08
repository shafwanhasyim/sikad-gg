import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MahasiswaList from './pages/MahasiswaList';
import MahasiswaForm from './pages/MahasiswaForm';
import MahasiswaDetail from './pages/MahasiswaDetail';
import MataKuliahList from './pages/MataKuliahList';
import MataKuliahForm from './pages/MataKuliahForm';
import MataKuliahDetail from './pages/MataKuliahDetail';
import NilaiList from './pages/NilaiList';
import NilaiForm from './pages/NilaiForm';
import NilaiDetail from './pages/NilaiDetail';
import Ranking from './pages/Ranking';

/**
 * Application router configuration
 * Contains all route definitions for the application
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="/" element={<Dashboard />} />
      
      {/* Mahasiswa Routes */}
      <Route path="/student" element={<MahasiswaList />} />
      <Route path="/student/add" element={<MahasiswaForm />} />
      <Route path="/student/edit/:id" element={<MahasiswaForm />} />
      <Route path="/student/:id" element={<MahasiswaDetail />} />
      
      {/* Mata Kuliah Routes */}
      <Route path="/class" element={<MataKuliahList />} />
      <Route path="/class/add" element={<MataKuliahForm />} />
      <Route path="/class/edit/:id" element={<MataKuliahForm />} />
      <Route path="/class/:id" element={<MataKuliahDetail />} />
      
      {/* Nilai Routes */}
      <Route path="/grade/add" element={<NilaiForm />} />
      <Route path="/grade" element={<NilaiList />} />
      <Route path="/grade/edit/:id" element={<NilaiForm />} />
      <Route path="/grade/:id" element={<NilaiDetail />} />
      
      {/* Special Routes */}
      <Route path="/ranking" element={<Ranking />} />
      
      {/* Fallback Route - will redirect to Dashboard if no other routes match */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRouter;
