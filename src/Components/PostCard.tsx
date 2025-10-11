import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaRegStar,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import "./PostCard.css";

// กำหนด interface ของ post
interface Post {
  id: number | string;
  title: string;
  description: string;
  userProfile?: string;
  username: string;
  image?: string;
  likes?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
  isBookmarked?: boolean;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [favorited, setFavorited] = useState(post.isFavorited || false);
  const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);

  const [likeAnim, setLikeAnim] = useState(false);
  const [favAnim, setFavAnim] = useState(false);
  const [bookmarkAnim, setBookmarkAnim] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 300);

    fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ like: !liked }),
    }).catch(console.error);
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    setFavAnim(true);
    setTimeout(() => setFavAnim(false), 300);

    fetch(`http://localhost:5000/api/posts/${post.id}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !favorited }),
    }).catch(console.error);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    setBookmarkAnim(true);
    setTimeout(() => setBookmarkAnim(false), 300);

    fetch(`http://localhost:5000/api/posts/${post.id}/bookmark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookmark: !bookmarked }),
    }).catch(console.error);
  };

  return (
    <div className="post-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e0e0e0", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontFamily: "Roboto, sans-serif" }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: "18px", fontWeight: "600", margin: "0 0 8px" }}>{post.title}</h3>
        <p style={{ color: "#555", fontSize: "14px", margin: "0 0 12px" }}>{post.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img src={post.userProfile || "https://placehold.co/30x30"} alt="user" style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }} />
          <span style={{ fontWeight: 500 }}>{post.username}</span>
          <span style={{ margin: "0 8px", color: "#aaa" }}>|</span>

          <button onClick={handleLike} className={likeAnim ? "icon-animate-heart" : ""} style={{ background: "none", border: "none", cursor: "pointer", color: liked ? "red" : "#888", display: "flex", alignItems: "center" }}>
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span style={{ marginLeft: 5 }}>{likesCount} likes</span>
          </button>

          <button onClick={handleFavorite} className={favAnim ? "icon-animate-star" : ""} style={{ background: "none", border: "none", cursor: "pointer", color: favorited ? "gold" : "#555", marginLeft: 10 }}>
            {favorited ? <FaStar /> : <FaRegStar />}
          </button>

          <button onClick={handleBookmark} className={bookmarkAnim ? "icon-animate-bookmark" : ""} style={{ background: "none", border: "none", cursor: "pointer", color: bookmarked ? "green" : "#555", marginLeft: 8 }}>
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      <div>
        <img src={post.image || "https://placehold.co/120x120"} alt="post" style={{ width: 120, height: 120, borderRadius: "8px", objectFit: "cover" }} />
      </div>
    </div>
  );
}
