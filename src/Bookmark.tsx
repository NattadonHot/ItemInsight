import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Styles/Bookmark.css";

interface UserInfo {
  username?: string;
  avatarUrl?: string;
}

interface Post {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  createdAt: string;
  userId?: UserInfo;
  images?: { url: string }[];
}

export default function Bookmark() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_URL_API;
  const userId = localStorage.getItem("userId"); // สมมติว่ามีเก็บไว้

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userId) return setError("User not logged in");
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/posts/bookmarks/${userId}`);
        const data = await res.json();
        if (data.success || Array.isArray(data)) {
          // backend บาง version คืน array ตรง ๆ
          setBookmarks(data.success ? data.data : data);
        } else {
          setError("Failed to fetch bookmarks");
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError(String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [API_URL, userId]);

  if (loading) return <p className="loading">Loading bookmarks...</p>;
  if (error) return <p className="error">❌ {error}</p>;
  if (!bookmarks.length) return <p className="not-found">No bookmarks yet.</p>;

  return (
  <div className="bookmark-container">
    <h2>Your Bookmarked Posts</h2>
    <div className="bookmark-grid">
      {bookmarks.map((post) => (
        <div
          key={post._id}
          className="bookmark-card"
          onClick={() => navigate(`/posts/${post.slug}`)}
          style={{ cursor: "pointer" }} // ทำให้เด้งชัดเจนว่า clickable
        >
          <img
            src={post.images?.[0]?.url || "https://placehold.co/200x120"}
            alt={post.title}
            className="bookmark-image"
          />
          <div className="bookmark-info">
            <span className="bookmark-title">{post.title}</span>
            <span className="bookmark-user">
              {post.userId?.username || "Anonymous"}
            </span>
            <span className="bookmark-date">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              }).format(new Date(post.createdAt))}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
