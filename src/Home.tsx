import { useState, useEffect } from "react";
import PostCard from "./Components/PostCard";

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
  const [activeTab, setActiveTab] = useState("For you");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState(1); // เก็บ state ของ page ปัจจุบัน
  const [hasMore, setHasMore] = useState(true); // เก็บว่ายังมีข้อมูลให้โหลดอีกไหม

  const tabs = ["For you", "Fashion", "Skincare"];
  const API_URL = import.meta.env.VITE_URL_API;
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    document.title = "Home - ItemInsight";
  }, []);

  // 1. ปรับ useEffect นี้: เมื่อ Tab เปลี่ยน ให้รีเซ็ตทุกอย่าง
  useEffect(() => {
    setPage(1); // กลับไปหน้า 1
    setPosts([]); // ล้าง post เก่า
    setHasMore(true); // ตั้งค่าว่าน่าจะมีข้อมูลเพิ่ม
    setLoading(true); // เริ่มโหลดใหม่ (เพื่อให้ fetch useEffect ทำงาน)
    setError(null); // ล้าง error เก่า
  }, [activeTab]);

  // 2. สร้าง useEffect ใหม่สำหรับ Fetch ข้อมูล
  // จะทำงานเมื่อ page หรือ activeTab เปลี่ยน (แต่จะ fetch เมื่อ page > 0)
  useEffect(() => {
    // ถ้า page เป็น 0 (เช่น ตอนรีเซ็ต) หรือไม่มีข้อมูลให้โหลดแล้ว ก็ไม่ต้องทำอะไร
    if (page === 0 || !hasMore) {
      if (page > 0) setLoading(false); // ถ้าไม่ได้ fetch แต่ page > 0 ให้หยุด loading
      return;
    }

    const fetchPosts = async () => {
      setLoading(true); // เริ่มโหลด
      setError(null);

      try {
        let category = "";
        if (activeTab === "Fashion") category = "fashion";
        else if (activeTab === "Skincare") category = "beauty";

        // 3. ใช้ state 'page' ในการสร้าง params
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
          // 4. ถ้าเป็นหน้า 1 ให้ทับข้อมูลเก่า, ถ้าหน้า 2+ ให้ต่อท้าย
          if (page === 1) {
            setPosts(result.data);
          } else {
            setPosts((prevPosts) => [...prevPosts, ...result.data]);
          }

          // 5. เช็กว่ามีข้อมูลหน้าถัดไปหรือไม่
          // (ถ้า API คืนค่าน้อยกว่า 10 แสดงว่าหมดแล้ว)
          if (result.data.length < 10) {
            setHasMore(false);
          } else {
            setHasMore(true); // เผื่อไว้ในกรณีที่ข้อมูลมาเต็ม 10 พอดี
          }
        } else {
          throw new Error(result.message || "Failed to load posts");
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false); // หยุดโหลดเมื่อเสร็จสิ้น
      }
    };

    fetchPosts(); // เรียกใช้งาน fetch
  }, [page, activeTab, API_URL]); // ทำงานเมื่อ page หรือ activeTab เปลี่ยน

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

  // 6. สร้างฟังก์ชันสำหรับปุ่ม Load More
  const handleLoadMore = () => {
    // ถ้าไม่กำลังโหลด และยังมีข้อมูลเหลือ
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1); // เพิ่มเลขหน้า, ซึ่งจะ trigger useEffect ให้ fetch เอง
    }
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

  return (
    <div
      className="home-container"
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
      {/* Tabs */}
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
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ marginTop: "30px", width: "100%" }}>
        {/* Loading เฉพาะตอนโหลดหน้า 1 */}
        {loading && page === 1 && (
          <p style={{ textAlign: "center" }}>Loading posts...</p>
        )}

        {error && (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "5px",
              color: "#c00",
            }}
          >
            <strong>Error:</strong> {error}
            <br />
            <small>Check console for more details</small>
          </div>
        )}

        {/* แสดง "No posts" เมื่อโหลดเสร็จ, ไม่มี error, ไม่มี post, และเป็นหน้า 1 */}
        {!loading && !error && posts.length === 0 && page === 1 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No posts found for this category.
          </p>
        )}

        {/* แสดงรายการ Posts (มีเสมอแม้กำลังโหลดหน้า 2+) */}
        {posts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={transformPostForCard(post)}
                onToggleLike={() => toggleLike(post._id)}
                onToggleBookmark={() => toggleBookmark(post._id)}
              />
            ))}
          </div>
        )}

        {/* 7. เพิ่มปุ่ม Load More และข้อความสถานะ */}
        <div style={{ padding: "20px", textAlign: "center" }}>
          {/* แสดง "Loading..." เมื่อกำลังโหลดหน้า 2+ */}
          {loading && page > 1 && <p>Loading more posts...</p>}

          {/* แสดงปุ่ม "Load More" ... */}
          {!loading && hasMore && posts.length > 0 && (
            <button
              onClick={handleLoadMore}
              onMouseEnter={() => setIsHovered(true)} // ⭐️ เพิ่ม
              onMouseLeave={() => setIsHovered(false)} // ⭐️ เพิ่ม
              style={{
                // ⭐️ อัปเดต style ทั้งหมด
                padding: "10px 25px",
                fontSize: "15px",
                fontWeight: "bold",
                color: isHovered ? "white" : "black", // สลับสีตัวอักษร
                backgroundColor: isHovered ? "black" : "white", // สลับสีพื้นหลัง
                border: "1px solid black", // ขอบสีดำ
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.2s, color 0.2s", // เพิ่มอนิเมชัน
              }}
            >
              Load More
            </button>
          )}

          {/* แสดง "No more posts" เมื่อ: ไม่ได้โหลด, ไม่มีข้อมูลอีกแล้ว, และมี post แสดงอยู่บ้างแล้ว */}
          {!loading && !hasMore && posts.length > 0 && (
            <p style={{ color: "#666" }}>No more posts to load.</p>
          )}
        </div>
      </div>
    </div>
  );
}
