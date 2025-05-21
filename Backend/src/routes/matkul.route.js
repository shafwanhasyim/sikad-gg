const controller = require("../controllers/matkul.controller");
const express = require("express");
const router = express.Router();

router.post("/addMataKuliah", controller.addMataKuliah);
router.get("/getAllMataKuliah", controller.getAllMataKuliah);
router.get("/getMataKuliah/:id", controller.getMataKuliah);
router.put("/updateMataKuliah/:id", controller.updateMataKuliah);
router.delete("/deleteMataKuliah/:id", controller.deleteMataKuliah);

module.exports = router;
