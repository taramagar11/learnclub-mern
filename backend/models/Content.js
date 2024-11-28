const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  title: String,
  description: String,
  image: String,  // File path or URL to the image
  video: String,  // File path or URL to the video
  club: { type: Schema.Types.ObjectId, ref: 'Club' },
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
