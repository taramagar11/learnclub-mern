const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Path or URL for the image
      required: false,
    },
    video: {
      type: String, // Path or URL for the video
      required: false,
    },
    club: {
      type: Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
