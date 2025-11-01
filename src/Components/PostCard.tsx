import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaHeart,
    FaRegHeart,
    FaBookmark,
    FaRegBookmark,
} from "react-icons/fa";
import "../Styles/PostCard.css";

interface Post {
    id: string;
    title: string;
    slug: string;
    description: string;
    userProfile?: string;
    username: string;
    image?: string;
    likes?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    createdAt: string; // ✅ เพิ่มวันที่โพสต์
}


interface PostCardProps {
    post: Post;
    onToggleLike?: () => Promise<void>;       // เพิ่ม props สำหรับฟังก์ชันจาก parent
    onToggleBookmark?: () => Promise<void>;   // เพิ่ม props สำหรับฟังก์ชันจาก parent
}

// ✅ ตัวอย่าง: สมมติว่าเราเก็บ userId ไว้ใน localStorage หลัง login
const getCurrentUserId = () => localStorage.getItem("userId");

export default function PostCard({ post, onToggleLike, onToggleBookmark }: PostCardProps) {
    const [liked, setLiked] = useState(post.isLiked || false);
    const [likesCount, setLikesCount] = useState(post.likes || 0);
    const [bookmarked, setBookmarked] = useState(post.isBookmarked || false);
    const [likeAnim, setLikeAnim] = useState(false);
    const [bookmarkAnim, setBookmarkAnim] = useState(false);

    const API_URL = import.meta.env.VITE_URL_API;
    const userId = getCurrentUserId();

    // ✅ ฟังก์ชัน toggle like
    const handleLike = async () => {
        if (!userId) return alert("กรุณาเข้าสู่ระบบก่อนกดถูกใจ ❤️");

        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 300);

        try {
            await fetch(`${API_URL}/api/posts/${post.id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (onToggleLike) await onToggleLike();
        } catch (err) {
            console.error("Error toggling like:", err);
        }
    };

    // ✅ ฟังก์ชัน toggle bookmark
    const handleBookmark = async () => {
        if (!userId) return alert("กรุณาเข้าสู่ระบบก่อนกดบุ๊คมาร์ก 📑");

        setBookmarked(!bookmarked);
        setBookmarkAnim(true);
        setTimeout(() => setBookmarkAnim(false), 300);

        try {
            await fetch(`${API_URL}/api/posts/${post.id}/bookmark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            if (onToggleBookmark) await onToggleBookmark();
        } catch (err) {
            console.error("Error toggling bookmark:", err);
        }
    };

    return (
        <div
            className="post-card"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                marginBottom: "16px",
                backgroundColor: "#fff",
                fontFamily: "Roboto, sans-serif",
            }}
        >
            <div style={{ flex: 1, textAlign: "left" }}>
                <Link to={`/posts/${post.slug}`} className="post-title">
                    {post.title}
                </Link>
                <p style={{ color: "#999", fontSize: "12px", margin: "5px 0" }}>
                    {post.createdAt
                        ? new Date(post.createdAt).toLocaleString("en-GB", {  // ใช้ภาษาอังกฤษ
                            day: "2-digit",
                            month: "long",   // October, November
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,  // 24-hour format
                        })
                        : "Not specified"}
                </p>
                <p style={{ color: "#555", fontSize: "14px", margin: "15px 0 10px" }}>
                    {post.description}
                </p>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginTop: "40px",
                    }}
                >
                    <img
                        src={post.userProfile || "https://placehold.co/30x30"}
                        alt="user"
                        style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
                    />
                    <span style={{ fontWeight: 500 }}>{post.username}</span>
                    <span style={{ margin: "0 8px", color: "#aaa" }}>|</span>

                    {/* ❤️ ปุ่มกด Like */}
                    <button
                        onClick={handleLike}
                        className={likeAnim ? "icon-animate-heart" : ""}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: liked ? "red" : "#888",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {liked ? <FaHeart /> : <FaRegHeart />}
                        <span style={{ marginLeft: 5 }}>{likesCount} likes</span>
                    </button>

                    {/* 📑 ปุ่มกด Bookmark */}
                    <button
                        onClick={handleBookmark}
                        className={bookmarkAnim ? "icon-animate-bookmark" : ""}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: bookmarked ? "green" : "#555",
                            marginLeft: 8,
                        }}
                    >
                        {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                </div>
            </div>

            <div>
                <img
                    src={post.image || "https://placehold.co/120x120"}
                    alt="post"
                    style={{ width: 120, height: 120, borderRadius: "8px", objectFit: "cover" }}
                />
            </div>
        </div>
    );
}
