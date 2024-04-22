const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authentication');
const Blog = require('../Model/blogModel');

// router.get('/', async (req, res) => {
//   const { page = 1, limit = 20 } = req.query;
//   try {
//     const blogs = await Blog.find({ state: 'published' })
//       .populate('author', 'first_name last_name')
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort('-timestamp');
//     res.send(blogs);
//   } catch (err) {
//     res.status(500).send('Internal server error.');
//   }
// });

router.get('/', async (req, res) => {
  const { page = 1, limit = 20, author, title, tags, sortBy } = req.query;
  const query = { state: 'published' };
  const options = {
    populate: { path: 'author', select: 'first_name last_name' },
    skip: (page - 1) * limit,
    limit: parseInt(limit),
    sort: buildSortQuery(sortBy)
  };

  if (author) query['author'] = author;
  if (title) query['title'] = { $regex: title, $options: 'i' };
  if (tags) query['tags'] = { $in: tags.split(',') };

  try {
    const blogs = await Blog.find(query, null, options);
    res.send(blogs);
  } catch (err) {
    res.status(500).send('Internal server error.');
  }
});

function buildSortQuery(sortBy) {
  switch (sortBy) {
    case 'read_count':
      return { read_count: -1 };
    case 'reading_time':
      return { reading_time: 1 };
    case 'timestamp':
      return { timestamp: -1 };
    default:
      return { timestamp: -1 }; 
  }
}

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).populate(
      'author',
      'first_name last_name'
    );
    if (!blog) return res.status(404).send('Blog not found.');
    blog.read_count++;
    await blog.save();
    res.send(blog);
  } catch (err) {
    res.status(500).send('Internal server error.');
  }
});

router.post('/', authenticate, async (req, res) => {
  const { title, description, tags, body } = req.body;
  const { _id: author } = req.user;
  try {
    const blog = new Blog({ title, description, tags, author, body });
    await blog.save();
    res.status(201).json({
      message: 'Blog created successfully.',
      blog
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, description, tags, body } = req.body;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, description, tags, body },
      { new: true }
    );
    if (!updatedBlog) return res.status(404).send('Blog not found.');
    res.send('Blog updated successfully.');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return res.status(404).send('Blog not found.');
    res.send('Blog deleted successfully.');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;
