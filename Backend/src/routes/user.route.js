const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post("/addMahasiswa", controller.addMahasiswa);
router.get("/getAllMahasiswa", controller.getAllMahasiswa);
router.get("/getMahasiswa/:id", controller.getMahasiswa);
router.put("/updateMahasiswa/:id", controller.updateMahasiswa);
router.delete("/deleteMahasiswa/:id", controller.deleteMahasiswa);
router.get("/getMahasiswaNilai/:id", controller.getMahasiswaNilai);

module.exports = router;
