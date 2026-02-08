const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age must be positive'],
    max: [150, 'Age must be realistic']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
