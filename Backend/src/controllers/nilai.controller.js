const nilaiRepository = require("../repository/nilai.repository");
const userRepository = require("../repository/user.repository");
const mataKuliahRepository = require("../repository/matkul.repository");

exports.createNilai = async (req, res) => {
  const { mahasiswa, mataKuliah, nilai, semester } = req.body;
  try {
    const newNilai = await nilaiRepository.createNilai({
      mahasiswa,
      mataKuliah,
      nilai,
      semester,
    });
    res.status(201).json({
      message: "Data Nilai berhasil ditambahkan",
      data: newNilai,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAllNilai = async (req, res) => {
  try {
    const nilais = await nilaiRepository.getAllNilai();
    if (!nilais || nilais.length === 0) {
      return res.status(404).send("Data Nilai tidak ditemukan");
    }
    res.status(200).json(nilais);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getNilai = async (req, res) => {
  const { id } = req.params;
  try {
    const nilai = await nilaiRepository.getNilai(id);
    if (!nilai) return res.status(404).send("Data Nilai tidak ditemukan");
    res.status(200).json(nilai);
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};

exports.updateNilai = async (req, res) => {
  const { id } = req.params;
  const { mahasiswa, mataKuliah, nilai, semester } = req.body;
  try {
    const updatedNilai = await nilaiRepository.updateNilai(id, {
      mahasiswa,
      mataKuliah,
      nilai,
      semester,
    });
    if (!updatedNilai)
      return res.status(404).send("Data Nilai tidak ditemukan");
    res.status(200).json({
      message: "Data Nilai berhasil diupdate",
      data: updatedNilai,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteNilai = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNilai = await nilaiRepository.deleteNilai(id);
    if (!deletedNilai)
      return res.status(404).send("Data Nilai tidak ditemukan");
    res.status(200).json({
      message: "Data Nilai berhasil dihapus",
      data: deletedNilai,
    });
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};

exports.getNilaiByMahasiswa = async (req, res) => {
  const { mahasiswaId } = req.params;
  try {
    const nilais = await nilaiRepository.getNilaiByMahasiswa(mahasiswaId);
    if (!nilais || nilais.length === 0) {
      return res.status(404).send("Data Nilai tidak ditemukan");
    }
    res.status(200).json(nilais);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getNilaiByMataKuliah = async (req, res) => {
  const { mataKuliahId } = req.params;
  try {
    const nilais = await nilaiRepository.getNilaiByMataKuliah(mataKuliahId);
    if (!nilais || nilais.length === 0) {
      return res.status(404).send("Data Nilai tidak ditemukan");
    }
    res.status(200).json(nilais);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Menghitung IP Semester mahasiswa
exports.getIPSemesterMahasiswa = async (req, res) => {
  const { mahasiswaId } = req.params;
  const { semester } = req.query;
  try {
    // Pastikan parameter semester dalam format yang benar (contoh: "Ganjil 2023/2024")
    if (!semester.match(/^(Ganjil|Genap) \d{4}\/\d{4}$/)) {
      return res.status(400).json({
        message:
          "Format semester tidak valid. Gunakan format: Ganjil 2023/2024 atau Genap 2023/2024",
      });
    }

    const nilaiData = await nilaiRepository.getNilaiSemesterMahasiswa(
      mahasiswaId,
      semester
    );

    if (!nilaiData || nilaiData.length === 0) {
      return res.status(404).json({
        message: `Data nilai untuk mahasiswa dengan ID ${mahasiswaId} pada semester ${semester} tidak ditemukan`,
      });
    }

    // Data mahasiswa untuk detail respons
    const mahasiswa = await userRepository.getMahasiswa(mahasiswaId);

    let totalBobot = 0;
    let totalSKS = 0;
    let detailNilai = [];

    for (const nilai of nilaiData) {
      const sks = nilai.mataKuliah.sks;
      // Konversi nilai angka ke bobot
      let bobot = 0;
      let huruf = "";

      if (nilai.nilai >= 85) {
        bobot = 4.0;
        huruf = "A";
      } else if (nilai.nilai >= 80) {
        bobot = 3.7;
        huruf = "B+";
      } else if (nilai.nilai >= 75) {
        bobot = 3.4;
        huruf = "B";
      } else if (nilai.nilai >= 70) {
        bobot = 3.0;
        huruf = "C+";
      } else if (nilai.nilai >= 65) {
        bobot = 2.7;
        huruf = "C";
      } else if (nilai.nilai >= 60) {
        bobot = 2.3;
        huruf = "D+";
      } else if (nilai.nilai >= 55) {
        bobot = 2.0;
        huruf = "D";
      } else if (nilai.nilai >= 40) {
        bobot = 1.0;
        huruf = "E";
      } else {
        bobot = 0;
        huruf = "F";
      }

      totalBobot += bobot * sks;
      totalSKS += sks;

      // Tambahkan detail untuk setiap mata kuliah
      detailNilai.push({
        mataKuliah: nilai.mataKuliah.nama,
        kode: nilai.mataKuliah.kode,
        sks: sks,
        nilai: nilai.nilai,
        nilaiHuruf: huruf,
        bobot: bobot,
      });
    }

    const ips = totalSKS > 0 ? (totalBobot / totalSKS).toFixed(2) : 0;

    // Tentukan predikat berdasarkan IPS
    let predikat = "";
    if (ips >= 3.5) predikat = "Dengan Pujian";
    else if (ips >= 3.0) predikat = "Sangat Memuaskan";
    else if (ips >= 2.5) predikat = "Memuaskan";
    else if (ips >= 2.0) predikat = "Cukup";
    else predikat = "Kurang";

    res.status(200).json({
      mahasiswa: {
        id: mahasiswaId,
        nama: mahasiswa ? mahasiswa.name : null,
        npm: mahasiswa ? mahasiswa.npm : null,
        jurusan: mahasiswa ? mahasiswa.jurusan : null,
      },
      semester,
      jumlahMataKuliah: nilaiData.length,
      totalSKS,
      ips: parseFloat(ips),
      predikat,
      detailNilai,
    });
  } catch (err) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengkalkulasi IP Semester",
      error: err.message,
    });
  }
};

// Mendapatkan ranking mahasiswa berdasarkan nilai rata-rata
exports.getRankingMahasiswa = async (req, res) => {
  const { mataKuliahId } = req.query;
  try {
    let pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "mahasiswa",
          foreignField: "_id",
          as: "mahasiswa",
        },
      },
      { $unwind: "$mahasiswa" },
      {
        $group: {
          _id: "$mahasiswa._id",
          nama: { $first: "$mahasiswa.name" },
          npm: { $first: "$mahasiswa.npm" },
          jurusan: { $first: "$mahasiswa.jurusan" },
          rataRata: { $avg: "$nilai" },
          totalMataKuliah: { $sum: 1 },
        },
      },
      { $sort: { rataRata: -1 } },
      {
        $project: {
          _id: 1,
          nama: 1,
          npm: 1,
          jurusan: 1,
          rataRata: { $round: ["$rataRata", 2] },
          totalMataKuliah: 1,
        },
      },
    ];

    // Filter by mataKuliah if provided
    if (mataKuliahId) {
      try {
        const mataKuliahObjectId =
          nilaiRepository.convertToObjectId(mataKuliahId);
        pipeline.unshift({
          $match: { mataKuliah: mataKuliahObjectId },
        });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }

    const ranking = await nilaiRepository.aggregate(pipeline);

    if (!ranking || ranking.length === 0) {
      return res.status(404).json({ message: "Data ranking tidak tersedia" });
    }

    res.status(200).json(ranking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mendapatkan distribusi nilai untuk suatu mata kuliah
exports.getDistribusiNilai = async (req, res) => {
  const { mataKuliahId } = req.params;
  const { semester } = req.query;
  try {
    // Build match condition
    const matchCondition = {
      mataKuliah: nilaiRepository.convertToObjectId(mataKuliahId),
    };

    // Add semester filter if provided
    if (semester) {
      matchCondition.semester = semester;
    }

    const distribusi = await nilaiRepository.aggregate([
      {
        $match: matchCondition,
      },
      {
        $facet: {
          A: [{ $match: { nilai: { $gte: 85 } } }, { $count: "count" }],
          "B+": [
            { $match: { nilai: { $gte: 80, $lt: 85 } } },
            { $count: "count" },
          ],
          B: [
            { $match: { nilai: { $gte: 75, $lt: 80 } } },
            { $count: "count" },
          ],
          "C+": [
            { $match: { nilai: { $gte: 70, $lt: 75 } } },
            { $count: "count" },
          ],
          C: [
            { $match: { nilai: { $gte: 65, $lt: 70 } } },
            { $count: "count" },
          ],
          "D+": [
            { $match: { nilai: { $gte: 60, $lt: 65 } } },
            { $count: "count" },
          ],
          D: [
            { $match: { nilai: { $gte: 55, $lt: 60 } } },
            { $count: "count" },
          ],
          E: [{ $match: { nilai: { $lt: 55 } } }, { $count: "count" }],
          total: [{ $count: "count" }],
        },
      },
      {
        $project: {
          A: { $ifNull: [{ $arrayElemAt: ["$A.count", 0] }, 0] },
          "B+": { $ifNull: [{ $arrayElemAt: ["$B+.count", 0] }, 0] },
          B: { $ifNull: [{ $arrayElemAt: ["$B.count", 0] }, 0] },
          "C+": { $ifNull: [{ $arrayElemAt: ["$C+.count", 0] }, 0] },
          C: { $ifNull: [{ $arrayElemAt: ["$C.count", 0] }, 0] },
          "D+": { $ifNull: [{ $arrayElemAt: ["$D+.count", 0] }, 0] },
          D: { $ifNull: [{ $arrayElemAt: ["$D.count", 0] }, 0] },
          E: { $ifNull: [{ $arrayElemAt: ["$E.count", 0] }, 0] },
          total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
        },
      },
    ]);

    // Get mata kuliah info
    const mataKuliah = await mataKuliahRepository.getMataKuliah(mataKuliahId);

    res.status(200).json({
      mataKuliah,
      semester: semester || "Semua semester",
      distribusi: distribusi[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
