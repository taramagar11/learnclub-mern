const mongoose = require('mongoose');
const { Schema } = mongoose;

const clubSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate club titles
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Store the image file path or URL
      required: true,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'Please provide a valid image URL'],
    },
    hashtags: {
      type: [String], // Array of hashtags for search or categorization
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
      ref: 'User',  // Assuming you have a User model for admins or creators
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
