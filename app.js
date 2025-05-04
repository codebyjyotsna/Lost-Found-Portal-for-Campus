import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [search, type, tags]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts', {
        params: { search, type, tags },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts');
    }
  };

  return (
    <div className="app">
      <h1>Campus Lost & Found</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="posts">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p><strong>Type:</strong> {post.type}</p>
            <p><strong>Tags:</strong> {post.tags.join(', ')}</p>
            <img src={post.imageUrl} alt={post.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
