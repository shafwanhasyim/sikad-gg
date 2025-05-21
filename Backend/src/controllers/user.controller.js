const userRepository = require("../repository/user.repository");
const nilaiRepository = require("../repository/nilai.repository");

exports.addMahasiswa = async (req, res) => {
  const { name, npm, jurusan } = req.body;
  try {
    const user = await userRepository.createMahasiswa({ name, npm, jurusan });
    res
      .status(201)
      .json({ message: "Data Mahasiswa berhasil ditambahkan", data: user });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAllMahasiswa = async (req, res) => {
  try {
    const users = await userRepository.getAllMahasiswa();
    if (!users || users.length === 0) {
      return res.status(404).send("Data Mahasiswa tidak ditemukan");
    }
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getMahasiswa = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userRepository.getMahasiswa(id);
    if (!user) return res.status(404).send("Data Mahasiswa tidak ditemukan");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};

exports.updateMahasiswa = async (req, res) => {
  const { id } = req.params;
  const { name, npm, jurusan } = req.body;
  try {
    const user = await userRepository.updateMahasiswa(id, {
      name,
      npm,
      jurusan,
    });
    if (!user) return res.status(404).send("Data Mahasiswa tidak ditemukan");
    res
      .status(200)
      .json({ message: "Data Mahasiswa berhasil diupdate", data: user });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.deleteMahasiswa = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userRepository.deleteMahasiswa(id);
    if (!user) return res.status(404).send("Data Mahasiswa tidak ditemukan");
    res
      .status(200)
      .json({ message: "Data Mahasiswa berhasil dihapus", data: user });
  } catch (err) {
    res.status(400).send("ID tidak valid");
  }
};

exports.getMahasiswaNilai = async (req, res) => {
  const { id } = req.params;
  try {
    // Get the student's grades
    const nilaiList = await nilaiRepository.getNilaiByMahasiswa(id);

    if (!nilaiList || nilaiList.length === 0) {
      return res.status(404).send("Data nilai mahasiswa tidak ditemukan");
    }

    // Process each course grade and determine if passed (assume passing grade is 60)
    const processedNilai = nilaiList.map((nilai) => {
      const lulus = nilai.nilai >= 60;
      return {
        mataKuliah: nilai.mataKuliah.nama,
        kode: nilai.mataKuliah.kode,
        sks: nilai.mataKuliah.sks,
        semester: nilai.semester,
        nilai: nilai.nilai,
        lulus: lulus,
        keterangan: lulus ? "Lulus" : "Tidak Lulus",
      };
    });

    res.status(200).json({
      message: "Data nilai mahasiswa berhasil diambil",
      mahasiswa: nilaiList[0].mahasiswa.name,
      npm: nilaiList[0].mahasiswa.npm,
      jurusan: nilaiList[0].mahasiswa.jurusan,
      data: processedNilai,
    });
  } catch (err) {
    res.status(400).send("ID tidak valid atau " + err.message);
  }
};
