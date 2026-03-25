const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  progress: [{
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
    season: Number,
    episode: Number,
    time: Number,
  }],
}, { timestamps: true });

// نزيل middleware ونستخدم function static للتشفير
userSchema.statics.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
