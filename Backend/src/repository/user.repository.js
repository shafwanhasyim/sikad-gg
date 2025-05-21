const User = require("../../models/UserSchema");

exports.createMahasiswa = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

exports.getAllMahasiswa = async () => {
  return await User.find();
};

exports.getMahasiswa = async (id) => {
  return await User.findById(id);
};

exports.updateMahasiswa = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

exports.deleteMahasiswa = async (id) => {
  return await User.findByIdAndDelete(id);
};
