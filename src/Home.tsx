import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import PostCard from "./Components/PostCard";
import "./Styles/Home.css";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_URL_API;
  const userId = localStorage.getItem("userId") || "";

  const categories = [
    "Fashion",
    "Skincare",
    "Tech",
    "Food",
    "Lifestyle",
    "Travel",
  ];

  useEffect(() => {
    document.title = "Home - ItemInsight";
  }, []);

  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    setLoading(true);
    setError(null);
  }, [selectedCategory, sortOrder]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          sort: sortOrder === "Newest" ? "desc" : "asc",
        });

        if (selectedCategory !== "All") {
          params.append("category", selectedCategory.toLowerCase());
        }

        const response = await fetch(`${API_URL}/api/posts?${params}`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();

        if (result.success) {
          if (page === 1) {
            setPosts(result.data);
          } else {
            setPosts((prev) => [...prev, ...result.data]);
          }
          if (result.data.length < 10) setHasMore(false);
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
  }, [page, selectedCategory, sortOrder, API_URL]);

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

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage((prevPage) => prevPage + 1);
  };

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

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      (post.category && post.category.toLowerCase().includes(query)) ||
      (post.userId?.username &&
        post.userId.username.toLowerCase().includes(query))
    );
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      <Header open={open} setOpen={setOpen} onSearch={setSearchQuery} />
      <Sidebar open={open} setOpen={setOpen} onLogout={handleLogout} />

      <div className="home-container">
        {/* 🔹 Dropdown Category Filter */}
        <div className="filter-bar">
          <div className="filter-block">
            <label className="filter-label">Category:</label>
            <div className="custom-dropdown">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span className="dropdown-icon">▾</span>
            </div>
          </div>

          <div className="filter-block">
            <label className="filter-label">Sort by:</label>
            <div className="custom-dropdown">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
              </select>
              <span className="dropdown-icon">▾</span>
            </div>
          </div>
        </div>

        {/* 🔹 Posts Section */}
        <div className="content-section">
          {loading && page === 1 && (
            <p style={{ textAlign: "center" }}>Loading posts...</p>
          )}

          {error && <div className="message-box error">{error}</div>}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="message-box no-posts">
              No posts found for this category.
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

          <div style={{ padding: "20px", textAlign: "center" }}>
            {loading && page > 1 && <p>Loading more posts...</p>}

            {!loading && hasMore && filteredPosts.length > 0 && (
              <button className="load-more-btn" onClick={handleLoadMore}>
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
