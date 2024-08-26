import React, { useState } from 'react';
import { format } from 'timeago.js';
import './App.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const userEmail = "user@example.com"; // Replace with logic to fetch the logged-in user's email

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      const timestamp = new Date().toISOString();
      setPosts([{
        content: newPost,
        email: userEmail,
        time: timestamp,
        comments: [],
        likes: 0,
        dislikes: 0,
        reactions: {},
        userReaction: null,
        likedUsers: new Set(),
        isCommenting: false,
        category: selectedCategory,
      }, ...posts]);
      setNewPost("");
    }
  };

  const handleReaction = (index, reactionType) => {
    setPosts(prevPosts => {
      return prevPosts.map((post, i) => {
        if (i === index) {
          const userReaction = post.userReaction;
          const reactions = { ...post.reactions };

          if (userReaction) {
            reactions[userReaction]--;
            if (reactions[userReaction] === 0) {
              delete reactions[userReaction];
            }
          }

          if (userReaction !== reactionType) {
            reactions[reactionType] = (reactions[reactionType] || 0) + 1;
            return {
              ...post,
              reactions,
              userReaction: reactionType,
            };
          } else {
            return {
              ...post,
              reactions,
              userReaction: null,
            };
          }
        }
        return post;
      });
    });
  };

  const handleCommentSubmit = (postIndex, commentText) => {
    setPosts(prevPosts => {
      return prevPosts.map((post, i) => {
        if (i === postIndex) {
          const newComments = [...post.comments, { text: commentText, email: userEmail, time: new Date().toISOString() }];
          return {
            ...post,
            comments: newComments,
            isCommenting: false,
          };
        }
        return post;
      });
    });
  };

  const handleReplyClick = (postIndex) => {
    setPosts(prevPosts => {
      return prevPosts.map((post, i) => {
        if (i === postIndex) {
          return {
            ...post,
            isCommenting: !post.isCommenting,
          };
        }
        return post;
      });
    });
  };

  return (
    <div className="max-w-full mx-auto my-8 px-4">
      {/* Create Post Section */}
      <div className="mb-4">
        <div className="relative border border-gray-300 rounded-full bg-white flex items-center">
          <textarea
            className="w-full p-2 border-b border-gray-300 rounded-full text-gray-900 resize-none h-10 overflow-hidden"
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePostSubmit();
              }
            }}
          />
          <div className="absolute right-2 flex space-x-2">
            <button className="text-gray-500 hover:text-gray-700">
              📎
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              🖼️
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              🔗
            </button>
  {/* Post Button */}
  <button className="btn-hover-border " onClick={handlePostSubmit}>
  <span className="bn39span">Post</span>
</button>

          </div>
        </div>

        {/* Category Selection and Post Button */}
        <div className="mt-2 flex items-center space-x-2">
          <label className="text-gray-700"></label>
          <div className="flex space-x-2">
            {["All", "Career advice", "Mentorship", "Job Search - Interviewing", "Salaries & Compensation"].map((category) => (
              <button
                key={category}
                className={`px-4 py-1 rounded-full ${
                  selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed Section */}
      {posts
        .filter((post) => selectedCategory === "All" || post.category === selectedCategory)
        .map((post, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-100">
            <div className="text-left">
              <p className="text-black">
                <b>{post.email}</b> <span className="text-black">{format(post.time)}</span>
              </p>
              <p className="text-red-700 text-sm"> {post.category}</p>
            </div>
            <p className="text-left text-gray-900">{post.content}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                {/* Emoji Reactions */}
                <button
                  className={`text-black ${post.userReaction === 'like' ? 'font-bold' : ''}`}
                  onClick={() => handleReaction(index, 'like')}
                >
                  👍 {post.reactions.like || 0}
                </button>
                <button
                  className={`text-black ${post.userReaction === 'love' ? 'font-bold' : ''}`}
                  onClick={() => handleReaction(index, 'love')}
                >
                  🧠{post.reactions.love || 0}
                </button>
                <button
                  className={`text-black ${post.userReaction === 'haha' ? 'font-bold' : ''}`}
                  onClick={() => handleReaction(index, 'haha')}
                >
                  🤔 {post.reactions.haha || 0}
                </button>
                <button
                  className={`text-black ${post.userReaction === 'angry' ? 'font-bold' : ''}`}
                  onClick={() => handleReaction(index, 'angry')}
                >
                  😡 {post.reactions.angry || 0}
                </button>

                <CommentSection
                  postIndex={index}
                  onCommentSubmit={handleCommentSubmit}
                  comments={post.comments}
                  isCommenting={post.isCommenting}
                  onReplyClick={handleReplyClick}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const CommentSection = ({ postIndex, onCommentSubmit, comments, isCommenting, onReplyClick }) => {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (commentText.trim()) {
      onCommentSubmit(postIndex, commentText);
      setCommentText("");
    }
  };

  return (
    <div className="ml-4">
      {/* Render existing comments */}
      {comments.map((comment, i) => (
        <div key={i} className="text-left text-gray-700">
          <b>{comment.email}</b>: {comment.text} <span className="text-gray-500 text-xs">{format(comment.time)}</span>
        </div>
      ))}
      {isCommenting && (
        <div className="mt-2 flex items-center">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded-md p-1 text-black"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleComment} className="ml-2 text-blue-500">Reply</button>
        </div>
      )}
      <button onClick={() => onReplyClick(postIndex)} className="text-sm text-blue-500 mt-2">
        {isCommenting ? "Cancel" : "Reply"}
      </button>
    </div>
  );
};

export default Feed;
