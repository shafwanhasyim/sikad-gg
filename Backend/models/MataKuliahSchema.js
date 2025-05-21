const mongoose = require("mongoose");
const MataKuliahSchema = new mongoose.Schema({
  kode: {
    type: String,
    required: true,
    unique: true,
  },
  nama: {
    type: String,
    required: true,
  },
  sks: {
    type: Number,
    required: true,
  },
  jurusan: {
    type: String,
    required: true,
  },
});

const MataKuliah = mongoose.model("MataKuliah", MataKuliahSchema);
module.exports = MataKuliah;
