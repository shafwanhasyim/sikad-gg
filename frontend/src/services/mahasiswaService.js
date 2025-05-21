import api from './api';

// Mahasiswa API endpoints
const mahasiswaService = {
  // Get all mahasiswa
  getAllMahasiswa: async () => {
    try {
      const response = await api.get('/user/getAllMahasiswa');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to get all mahasiswa:", error.message);
      return [];
    }
  },
  
  // Get a single mahasiswa by ID
  getMahasiswa: async (id) => {
    try {
      if (!id) throw new Error("Mahasiswa ID is required");
      const response = await api.get(`/user/getMahasiswa/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get mahasiswa with ID ${id}:`, error.message);
      throw error;
    }
  },
  
  // Get mahasiswa with nilai
  getMahasiswaNilai: async (id) => {
    try {
      if (!id) throw new Error("Mahasiswa ID is required");
      const response = await api.get(`/user/getMahasiswaNilai/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get nilai for mahasiswa with ID ${id}:`, error.message);
      throw error;
    }
  },
  
  // Add a new mahasiswa
  addMahasiswa: async (data) => {
    try {
      const response = await api.post('/user/addMahasiswa', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a mahasiswa
  updateMahasiswa: async (id, data) => {
    try {
      const response = await api.put(`/user/updateMahasiswa/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a mahasiswa
  deleteMahasiswa: async (id) => {
    try {
      const response = await api.delete(`/user/deleteMahasiswa/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mahasiswaService;
