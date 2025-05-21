const controller = require("../controllers/nilai.controller");
const express = require("express");
const router = express.Router();

router.post("/addNilai", controller.createNilai);
router.get("/getAllNilai", controller.getAllNilai);
router.get("/getNilai/:id", controller.getNilai);
router.put("/updateNilai/:id", controller.updateNilai);
router.delete("/deleteNilai/:id", controller.deleteNilai);

// Advanced Queries
router.get("/getNilaiByMahasiswa/:mahasiswaId", controller.getNilaiByMahasiswa);
router.get(
  "/getNilaiByMataKuliah/:mataKuliahId",
  controller.getNilaiByMataKuliah
);
router.get("/ipSemester/:mahasiswaId", controller.getIPSemesterMahasiswa);
router.get("/ranking", controller.getRankingMahasiswa);
router.get("/distribusi/:mataKuliahId", controller.getDistribusiNilai);

module.exports = router;
