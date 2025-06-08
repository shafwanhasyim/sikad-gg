import api from "./api";

// Nilai API endpoints
const nilaiService = {
  // Get all nilai
  getAllNilai: async () => {
    try {
      const response = await api.get("/nilai/getAllNilai");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to get all nilai:", error.message);
      return [];
    }
  },

  // Get a single nilai by ID
  getNilai: async (id) => {
    try {
      if (!id) throw new Error("Nilai ID is required");
      const response = await api.get(`/nilai/getNilai/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Failed to get nilai with ID ${id}:`, error.message);
      throw error;
    }
  },

  // Add a new nilai
  addNilai: async (data) => {
    try {
      if (!data) throw new Error("Nilai data is required");
      const response = await api.post("/nilai/addNilai", data);
      return response.data;
    } catch (error) {
      console.error("Failed to add nilai:", error.message);
      throw error;
    }
  },

  // Update a nilai
  updateNilai: async (id, data) => {
    try {
      if (!id) throw new Error("Nilai ID is required");
      if (!data) throw new Error("Nilai data is required");
      const response = await api.put(`/nilai/updateNilai/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update nilai with ID ${id}:`, error.message);
      throw error;
    }
  },
  // Delete a nilai
  deleteNilai: async (id) => {
    try {
      if (!id) throw new Error("Nilai ID is required");
      const response = await api.delete(`/nilai/deleteNilai/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete nilai with ID ${id}:`, error.message);
      throw error;
    }
  },

  // Get nilai by mahasiswa ID
  getNilaiByMahasiswa: async (mahasiswaId) => {
    try {
      if (!mahasiswaId) throw new Error("Mahasiswa ID is required");
      const response = await api.get(
        `/nilai/getNilaiByMahasiswa/${mahasiswaId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        `Failed to get nilai for mahasiswa with ID ${mahasiswaId}:`,
        error.message
      );
      return [];
    }
  },

  // Get nilai by mata kuliah ID
  getNilaiByMataKuliah: async (mataKuliahId) => {
    try {
      if (!mataKuliahId) throw new Error("Mata Kuliah ID is required");
      const response = await api.get(
        `/nilai/getNilaiByMataKuliah/${mataKuliahId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(
        `Failed to get nilai for mata kuliah with ID ${mataKuliahId}:`,
        error.message
      );
      return [];
    }
  }, // Get IP semester for a mahasiswa
  getIpSemester: async (mahasiswaId, semester) => {
    try {
      if (!mahasiswaId) throw new Error("Mahasiswa ID is required");
      if (!semester)
        throw new Error("Semester is required (e.g. 'Ganjil 2023/2024')");

      const response = await api.get(`/nilai/ipSemester/${mahasiswaId}`, {
        params: { semester },
      });

      return response.data &&
        typeof response.data === "object" &&
        "ips" in response.data
        ? response.data.ips
        : null;
    } catch (error) {
      console.error(
        `Failed to get IP semester for mahasiswa with ID ${mahasiswaId}:`,
        error.message
      );
      return null;
    }
  },

  // Get ranking
  getRanking: async () => {
    try {
      const response = await api.get("/nilai/ranking");
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to get ranking:", error.message);
      return [];
    }
  },

  // Get grade distribution for a mata kuliah
  getDistribusi: async (mataKuliahId) => {
    try {
      if (!mataKuliahId) throw new Error("Mata Kuliah ID is required");
      const response = await api.get(`/nilai/distribusi/${mataKuliahId}`);
      return response.data && response.data.distribusi
        ? response.data.distribusi
        : {};
    } catch (error) {
      console.error(
        `Failed to get distribution for mata kuliah with ID ${mataKuliahId}:`,
        error.message
      );
      return {};
    }
  },
};

export default nilaiService;
