const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas and Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  studentId: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  type: { type: String, enum: ['Lost', 'Found'], required: true },
  title: { type: String, required: true },
  description: String,
  tags: [String],
  location: String,
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

// Routes
app.post('/api/upload', async (req, res) => {
  try {
    const file = req.body.image; // Base64 image
    const result = await cloudinary.uploader.upload(file, { folder: 'lostfound' });
    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).send('Image upload failed');
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).send('Failed to create post');
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const { search, type, tags } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (type) {
      query.type = type;
    }
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).send('Failed to fetch posts');
  }
});

// Text index for fuzzy search
Post.collection.createIndex({ title: 'text', description: 'text' });

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
