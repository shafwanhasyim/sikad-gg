const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  npm: {
    type: String,
    required: [true, "NPM is required"],
  },
  jurusan: {
    type: String,
    required: [true, "Jurusan is required"],
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
