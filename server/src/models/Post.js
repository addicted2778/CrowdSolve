const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String,
  title: String,
  description: String,
  location: String,
  imageUrl: String,
  solutions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Solution' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
