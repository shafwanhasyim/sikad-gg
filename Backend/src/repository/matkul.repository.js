const MataKuliah = require("../../models/MataKuliahSchema");

exports.createMataKuliah = async (matkulData) => {
  const matkul = new MataKuliah(matkulData);
  return await matkul.save();
};

exports.getAllMataKuliah = async () => {
  return await MataKuliah.find();
};

exports.getMataKuliah = async (id) => {
  return await MataKuliah.findById(id);
};

exports.updateMataKuliah = async (id, matkulData) => {
  return await MataKuliah.findByIdAndUpdate(id, matkulData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMataKuliah = async (id) => {
  return await MataKuliah.findByIdAndDelete(id);
};
