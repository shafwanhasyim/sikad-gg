import api from './api';

// Mata Kuliah API endpoints
const mataKuliahService = {
  // Get all mata kuliah
  getAllMataKuliah: async () => {
    try {
      const response = await api.get('/matakuliah/getAllMataKuliah');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to get all mata kuliah:", error.message);
      return [];
    }
  },
  
  // Get a single mata kuliah by ID
  getMataKuliah: async (id) => {
    try {
      if (!id) throw new Error("Mata Kuliah ID is required");
      const response = await api.get(`/matakuliah/getMataKuliah/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get mata kuliah with ID ${id}:`, error.message);
      throw error;
    }
  },
    // Add a new mata kuliah
  addMataKuliah: async (data) => {
    try {
      const response = await api.post('/matakuliah/addMataKuliah', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a mata kuliah
  updateMataKuliah: async (id, data) => {
    try {
      const response = await api.put(`/matakuliah/updateMataKuliah/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a mata kuliah
  deleteMataKuliah: async (id) => {
    try {
      const response = await api.delete(`/matakuliah/deleteMataKuliah/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mataKuliahService;
