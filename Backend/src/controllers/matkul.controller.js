const mataKuliahRepository = require("../repository/matkul.repository");

exports.addMataKuliah = async (req, res) => {
  const { kode, nama, sks, jurusan } = req.body;
  try {
    const mataKuliah = await mataKuliahRepository.createMataKuliah({
      kode,
      nama,
      sks,
      jurusan,
    });
    res.status(201).json({
      message: "Data Mata Kuliah berhasil ditambahkan",
      data: mataKuliah,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAllMataKuliah = async (req, res) => {
  try {
    const mataKuliahs = await mataKuliahRepository.getAllMataKuliah();
    if (!mataKuliahs || mataKuliahs.length === 0) {
      return res.status(404).send("Data Mata Kuliah tidak ditemukan");
    }
    res.status(200).json(mataKuliahs);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getMataKuliah = async (req, res) => {
  const { id } = req.params;
  try {
    const mataKuliah = await mataKuliahRepository.getMataKuliah(id);
    if (!mataKuliah)
      return res.status(404).send("Data Mata Kuliah tidak ditemukan");
    res.status(200).json(mataKuliah);
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};

exports.updateMataKuliah = async (req, res) => {
  const { id } = req.params;
  const { kode, nama, sks, jurusan } = req.body;
  try {
    const mataKuliah = await mataKuliahRepository.updateMataKuliah(id, {
      kode,
      nama,
      sks,
      jurusan,
    });
    if (!mataKuliah)
      return res.status(404).send("Data Mata Kuliah tidak ditemukan");
    res.status(200).json({
      message: "Data Mata Kuliah berhasil diupdate",
      data: mataKuliah,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteMataKuliah = async (req, res) => {
  const { id } = req.params;
  try {
    const mataKuliah = await mataKuliahRepository.deleteMataKuliah(id);
    if (!mataKuliah)
      return res.status(404).send("Data Mata Kuliah tidak ditemukan");
    res.status(200).json({
      message: "Data Mata Kuliah berhasil dihapus",
      data: mataKuliah,
    });
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};
