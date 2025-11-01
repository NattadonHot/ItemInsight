import { useState, useEffect } from "react";
import PostCard from "./Components/PostCard";

interface Post {
  _id: string;
  slug?: string; // ถ้า backend มี slug
  title: string;
  subtitle?: string;
  userId?: {
    username: string;
    avatarUrl?: string;
  };
  images: Array<{
    url: string;
    publicId: string;
  }>;
  likesCount: number;
  category: string;
  createdAt: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_URL_API || "http://localhost:3000";

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "My Posts - ItemInsight";
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    if (!userId || !token) {
      setError("You must be logged in to see your posts.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // URL backend จริง
      const apiUrl = `${API_URL}/api/posts/user/${userId}`;
      console.log("Fetching my posts from:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ถ้าไม่ ok, log text เพื่อ debug
      if (!response.ok) {
        const text = await response.text();
        console.error("API error response:", text);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("My Posts Result:", result);

      if (result.success) {
        setPosts(result.data);
      } else {
        throw new Error(result.message || "Failed to load posts");
      }
    } catch (err) {
      console.error("Error fetching my posts:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const transformPostForCard = (post: Post) => ({
    id: post._id,
    slug: post.slug || post._id,
    title: post.title,
    description: post.subtitle || "",
    username: post.userId?.username || "You",
    userProfile: post.userId?.avatarUrl || "https://placehold.co/30x30",
    image: post.images?.[0]?.url || "https://placehold.co/120x120",
    likes: post.likesCount || 0,
    isLiked: false,
    isFavorited: false,
    isBookmarked: false,
    createdAt: post.createdAt, // ✅ เพิ่มตรงนี้
  });

  return (
    <div
      className="myposts-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        marginTop: "70px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        My Posts
      </h2>

      <div style={{ width: "100%" }}>
        {loading && (
          <p style={{ textAlign: "center" }}>Loading your posts...</p>
        )}

        {error && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "5px",
              color: "#c00",
              textAlign: "center",
            }}
          >
            <strong>Error:</strong> {error}
            <br />
            <small>Check console for more details</small>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            You haven’t written any posts yet.
          </p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {posts.map((post) => (
              <PostCard key={post._id} post={transformPostForCard(post)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
