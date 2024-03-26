import React from 'react';
import { useParams } from 'react-router-dom';
import { blogposts as posts } from './BlogPosts';

const SingleBlogPost = () => {
  const { id } = useParams(); // Get the id parameter from the URL
  const post = posts.find(post => post.id === (id)); // Find the blog post with the matching id

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.imageUrl} alt={post.title} />
      <p>{post.date.toLocaleDateString()}</p>
      <p>{post.content}</p> {/* Assuming you have content property in your posts */}
    </div>
  );
};

export default SingleBlogPost;
