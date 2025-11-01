import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import PostCard from "./Components/PostCard";
import "./Styles/Home.css"; // ✅ import CSS

interface Post {
  _id: string;
  slug: string;
  title: string;
  subtitle?: string;
  userId?: {
    username: string;
    avatarUrl?: string;
  };
  images: Array<{ url: string; publicId: string }>;
  likesCount: number;
  likedUsers?: string[];
  bookmarkedUsers?: string[];
  category: string;
  createdAt: string;
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("For you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = ["For you", "Fashion", "Skincare"];
  const API_URL = import.meta.env.VITE_URL_API;
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    document.title = "Home - ItemInsight";
  }, []);

  // รีเซ็ตข้อมูลเมื่อเปลี่ยนแท็บ
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    setLoading(true);
    setError(null);
  }, [activeTab]);

  // Fetch posts
  useEffect(() => {
    if (page === 0 || !hasMore) {
      if (page > 0) setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        let category = "";
        if (activeTab === "Fashion") category = "fashion";
        else if (activeTab === "Skincare") category = "beauty";

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });
        if (category) params.append("category", category);

        const response = await fetch(
          `${API_URL}/api/posts?${params.toString()}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.success) {
          if (page === 1) {
            setPosts(result.data);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...result.data]);
          }
          if (result.data.length < 10) setHasMore(false);
          else setHasMore(true);
        } else {
          throw new Error(result.message || "Failed to load posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, activeTab, API_URL]);

  // Toggle like
  const toggleLike = async (postId: string) => {
    if (!userId) return alert("Please login first");
    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  likesCount: data.likesCount,
                  likedUsers: data.liked ? [userId] : [],
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (postId: string) => {
    if (!userId) return alert("Please login first");
    try {
      const res = await fetch(
        `${API_URL}/api/posts/${postId}/toggle-bookmark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, bookmarkedUsers: data.bookmarked ? [userId] : [] }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Load more
  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prevPage) => prevPage + 1);
  };

  // Transform post for PostCard
  const transformPostForCard = (post: Post) => ({
    id: post._id,
    slug: post.slug,
    title: post.title,
    description: post.subtitle || "",
    username: post.userId?.username || "Anonymous",
    userProfile: post.userId?.avatarUrl || "https://placehold.co/30x30",
    image: post.images?.[0]?.url || "https://placehold.co/120x120",
    likes: post.likesCount || 0,
    isLiked: post.likedUsers?.includes(userId) || false,
    isBookmarked: post.bookmarkedUsers?.includes(userId) || false,
  });

  // Filter posts by search query
  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query)) ||
      (post.userId?.username &&
        post.userId.username.toLowerCase().includes(query))
    );
  });

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatarUrl");
    window.location.href = "/login"; // Redirect
  };

  return (
    <>
      <Header
        open={open}
        setOpen={setOpen}
        onSearch={(q) => setSearchQuery(q)}
      />
      <Sidebar open={open} setOpen={setOpen} onLogout={handleLogout} />

      <div className="home-container">
        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab-item ${activeTab === tab ? "active" : ""}`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="content-section">
          {loading && page === 1 && (
            <p style={{ textAlign: "center" }}>Loading posts...</p>
          )}

          {error && (
            <div className="message-box error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && page === 1 && (
            <div className="message-box no-posts">
              No posts found for this category or search.
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="post-list">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={transformPostForCard(post)}
                  onToggleLike={() => toggleLike(post._id)}
                  onToggleBookmark={() => toggleBookmark(post._id)}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          <div style={{ padding: "20px", textAlign: "center" }}>
            {loading && page > 1 && <p>Loading more posts...</p>}

            {!loading && hasMore && filteredPosts.length > 0 && (
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Load More
              </button>
            )}

            {!loading && !hasMore && filteredPosts.length > 0 && (
              <p style={{ color: "#666" }}>No more posts to load.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
