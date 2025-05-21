const mongoose = require("mongoose");
const NilaiSchema = new mongoose.Schema({
  mahasiswa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mataKuliah: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MataKuliah",
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  nilai: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
});

const Nilai = mongoose.model("Nilai", NilaiSchema);
module.exports = Nilai;
