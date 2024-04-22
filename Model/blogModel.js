const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  read_count: {
    type: Number,
    default: 0
  },
  body: {
    type: String,
    required: true
  },
});

// Calculates reading time before saving
blogSchema.pre('save', function (next) {

  const wordCount = this.body.split(/\s+/).length;

  // Assuming average reading speed is 200 words per minute
  const wordsPerMinute = 200;

  // Calculate reading time in minutes
  this.reading_time = Math.ceil(wordCount / wordsPerMinute);

  next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
