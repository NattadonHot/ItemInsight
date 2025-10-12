import { useState, useEffect } from "react";
import PostCard from "./Components/PostCard";

interface Post {
  _id: string;
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

export default function Home() {
  const [activeTab, setActiveTab] = useState("For you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = ["For you", "Fashion", "Skincare"];

  const API_URL = import.meta.env.VITE_URL_API;

  useEffect(() => {
    document.title = "Home - ItemInsight";
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      let category = "";
      if (activeTab === "Fashion") {
        category = "fashion";
      } else if (activeTab === "Skincare") {
        category = "beauty";
      }

      const params = new URLSearchParams({
        page: "1",
        limit: "10",
      });

      if (category) {
        params.append("category", category);
      }

      const apiUrl = `${API_URL}/api/posts?${params.toString()}`;
      console.log("Fetching from:", apiUrl);

      const response = await fetch(apiUrl);
      
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Result:", result);

      if (result.success) {
        setPosts(result.data);
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

  // แปลง Post จาก database ให้เป็นรูปแบบที่ PostCard ต้องการ
  const transformPostForCard = (post: Post) => {
    return {
      id: post._id,
      title: post.title,
      description: post.subtitle || "",
      username: post.userId?.username || "Anonymous",
      userProfile: post.userId?.avatarUrl || "https://placehold.co/30x30",
      image: post.images?.[0]?.url || "https://placehold.co/120x120",
      likes: post.likesCount || 0,
      isLiked: false,
      isFavorited: false,
      isBookmarked: false,
    };
  };

  return (
    <div
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
      {/* Tabs - จัดกลาง */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginTop: "20px",
          marginBottom: "20px",
          width: "100%",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: activeTab === tab ? "black" : "gray",
              padding: "10px 0",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div
                style={{
                  height: "2px",
                  backgroundColor: "black",
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  right: "0",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ marginTop: "30px", width: "100%" }}>
        {loading && (
          <p style={{ textAlign: "center" }}>Loading posts...</p>
        )}
        
        {error && (
          <div style={{ 
            padding: "20px", 
            backgroundColor: "#fee", 
            border: "1px solid #fcc",
            borderRadius: "5px",
            color: "#c00"
          }}>
            <strong>Error:</strong> {error}
            <br />
            <small>Check console for more details</small>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No posts found for this category.
          </p>
        )}

        {!loading && !error && posts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {posts.map((post) => (
              <PostCard key={post._id} post={transformPostForCard(post)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}