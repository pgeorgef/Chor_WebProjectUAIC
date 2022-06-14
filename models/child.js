const mongoose = require('mongoose');

const { Schema } = mongoose;

const childSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Child = mongoose.model('Child', childSchema);
module.exports = { childSchema, Child };
