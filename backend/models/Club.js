const mongoose = require('mongoose');
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      // Remove URL validation, since it's a local file path
      // match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Please provide a valid image URL'],
    },
    hashtags: {
      type: [String],
      required: true,
      validate: {
        validator: function(value) {
          return Array.isArray(value) && value.every(tag => typeof tag === 'string');
        },
        message: 'Hashtags should be an array of strings',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
