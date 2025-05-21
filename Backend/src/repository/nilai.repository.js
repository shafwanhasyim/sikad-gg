const Nilai = require("../../models/NilaiSchema");
const mongoose = require("mongoose");

exports.aggregate = async (pipeline) => {
  return await Nilai.aggregate(pipeline);
};

exports.convertToObjectId = (id) => {
  if (!id) return null;

  try {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    throw new Error("Invalid ID format");
  } catch (error) {
    throw new Error("Invalid ID format: " + id);
  }
};

exports.createNilai = async (nilaiData) => {
  const nilai = new Nilai(nilaiData);
  return await nilai.save();
};

exports.getAllNilai = async () => {
  return await Nilai.find().populate("mahasiswa mataKuliah");
};

exports.getNilai = async (id) => {
  return await Nilai.findById(id).populate("mahasiswa mataKuliah");
};

exports.updateNilai = async (id, nilaiData) => {
  return await Nilai.findByIdAndUpdate(id, nilaiData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteNilai = async (id) => {
  return await Nilai.findByIdAndDelete(id);
};

exports.getNilaiByMahasiswa = async (mahasiswaId) => {
  return await Nilai.find({ mahasiswa: mahasiswaId }).populate(
    "mahasiswa mataKuliah"
  );
};

exports.getNilaiByMataKuliah = async (mataKuliahId) => {
  return await Nilai.find({ mataKuliah: mataKuliahId }).populate(
    "mahasiswa mataKuliah"
  );
};

exports.getNilaiSemesterMahasiswa = async (mahasiswaId, semester) => {
  return await Nilai.find({
    mahasiswa: mahasiswaId,
    semester: semester,
  }).populate("mahasiswa mataKuliah");
};


