import { Heart, ShoppingCart, Bookmark, Share2, MoreHorizontal, MessageCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Styles/PostDetail.css";

interface Block { id?: string; type?: string; data?: { text?: string }; }
interface ProductLink { name: string; url: string; }
interface UserInfo { username?: string; avatarUrl?: string; }
interface Comment { _id: string; userId: string; username: string; avatarUrl?: string; text: string; createdAt: string; }
interface Post {
    _id: string; slug: string; title: string; subtitle?: string; userId?: UserInfo;
    createdAt: string; images?: { url: string }[]; blocks?: Block[];
    productLinks?: ProductLink[]; likesCount?: number; likedUsers?: string[]; bookmarkedUsers?: string[];
}

export default function PostDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_URL_API;
    const currentUsername = localStorage.getItem("username") || "";
    const userId = localStorage.getItem("userId") || "";
    const token = localStorage.getItem("token");

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [likeAnim, setLikeAnim] = useState(false);

    const [comments, setComments] = useState<Comment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");

    const [bookmarked, setBookmarked] = useState(false);
    const [bookmarkAnim, setBookmarkAnim] = useState(false);

    const [showCartLinks, setShowCartLinks] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);

    const commentsEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // ------------------- FETCH POST -------------------
    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/api/posts/slug/${slug}`);
                const result = await res.json();
                if (result.success) {
                    const postData = result.data as Post;
                    setPost(postData);
                    setLiked(postData.likedUsers?.includes(userId) || false);
                    setBookmarked(postData.bookmarkedUsers?.includes(userId) || false);
                    setLikesCount(postData.likesCount || 0);
                } else setError(result.message || "Failed to fetch post");
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : String(err));
            } finally { setLoading(false); }
        };
        fetchPost();
    }, [slug, API_URL, userId]);

    // ------------------- FETCH COMMENTS -------------------
    useEffect(() => {
        const fetchComments = async () => {
            if (!post?._id) return;
            try {
                const res = await fetch(`${API_URL}/api/posts/${post._id}/comments`);
                const data = await res.json();
                if (data.success) setComments(data.comments);
            } catch (err) { console.error(err); }
        };
        fetchComments();
    }, [post]);

    // ------------------- HANDLE CLICK OUTSIDE -------------------
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) setShowCartLinks(false);
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) setShowMoreMenu(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ------------------- LIKE -------------------
    const handleLike = async () => {
        if (!userId) return alert("กรุณาเข้าสู่ระบบก่อนกดถูกใจ ❤️");
        setLiked(!liked);
        setLikesCount(liked ? likesCount - 1 : likesCount + 1);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 300);
        try {
            const res = await fetch(`${API_URL}/api/posts/${post?._id}/toggle-like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) { setLiked(data.liked); setLikesCount(data.likesCount); }
        } catch (err) { console.error(err); }
    };

    /* ------------------- 💬 ADD COMMENT ------------------- */
const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
        const res = await fetch(`${API_URL}/api/posts/${post?._id}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: newComment }),
        });

        const data = await res.json();

        if (data.success) {
            const newCmt = data.comment;

            // สร้าง Comment object สำหรับ frontend
            const commentObj: Comment = {
                _id: newCmt._id,                   // ใช้ _id ที่ backend ส่งมา
                userId: newCmt.userId,             // แค่เก็บ id
                username: newCmt.username || currentUsername,
                avatarUrl: localStorage.getItem("avatarUrl") || "",
                text: newCmt.text,
                createdAt: newCmt.createdAt,
            };

            // เพิ่ม comment ใหม่ลง state
            setComments(prev => [...prev, commentObj]);
            setNewComment("");
            scrollToBottom();
        } else {
            alert(data.message || "เกิดข้อผิดพลาดในการส่งคอมเมนต์");
        }
    } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการส่งคอมเมนต์");
    }
};

    // ------------------- BOOKMARK -------------------
    const handleBookmark = async () => {
        if (!userId) return alert("กรุณาเข้าสู่ระบบก่อนกดบุ๊คมาร์ก 📑");
        setBookmarked(!bookmarked);
        setBookmarkAnim(true);
        setTimeout(() => setBookmarkAnim(false), 300);
        try {
            const res = await fetch(`${API_URL}/api/posts/${post?._id}/toggle-bookmark`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) setBookmarked(data.bookmarked);
        } catch (err) { console.error(err); }
    };

    // ------------------- SHARE -------------------
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            const shareBtn = document.querySelector(".share-button");
            shareBtn?.classList.add("shake");
            setTimeout(() => shareBtn?.classList.remove("shake"), 500);
            alert("ลิงก์ถูกคัดลอกแล้ว ✅");
        } catch (err) { console.error("ไม่สามารถคัดลอกลิงก์ได้", err); }
    };

    // ------------------- DELETE POST -------------------
    const handleDeletePost = async () => {
        if (!post) return;
        if (!confirm("คุณแน่ใจว่าจะลบโพสต์นี้?")) return;
        try {
            const res = await fetch(`${API_URL}/api/posts/${post._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const result = await res.json();
            if (result.success) { alert("ลบโพสต์สำเร็จ ✅"); navigate("/home"); }
            else alert(result.message || "เกิดข้อผิดพลาดในการลบโพสต์");
        } catch (err) { console.error(err); alert("เกิดข้อผิดพลาด"); }
    };

    if (loading) return <p className="loading">Loading post...</p>;
    if (error) return <p className="error">❌ {error}</p>;
    if (!post) return <p className="not-found">Post not found.</p>;

    const isOwner = post.userId?.username === currentUsername;

    return (
        <div className="detail-container">
            <h2 className="detail-title">{post.title}</h2>
            {post.subtitle && <p className="detail-subtitle">{post.subtitle}</p>}
            <div className="detail-user">
                <img src={post.userId?.avatarUrl || "https://placehold.co/40x40"} alt="User avatar" className="detail-avatar" />
                <span className="detail-username">{post.userId?.username || "Anonymous"}</span>
                <span className="detail-date">{new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(post.createdAt))}</span>
            </div>
            <hr />

            {/* Action Icons */}
            <div className="action-icons-wrapper">
                <div className="action-icons-left">
                    <button className={`icon-button like-button ${liked ? "liked" : ""} ${likeAnim ? "icon-animate-heart" : ""}`} onClick={handleLike}>
                        <Heart className="icon" /> <span>{likesCount} likes</span>
                    </button>
                    <button className="icon-button comment-button" onClick={() => setShowComments(!showComments)}>
                        <MessageCircle className="icon" /> <span>{comments.length}</span>
                    </button>
                </div>

                <div className="action-icons-right">
                    {/* Cart */}
                    <div className={`cart-dropdown ${showCartLinks ? "show" : ""}`} ref={cartRef}>
                        <button className="icon-button cart-button" onClick={() => setShowCartLinks(!showCartLinks)}>
                            <ShoppingCart className="icon" />
                        </button>
                        {post.productLinks?.length ? (
                            <div className={`cart-menu ${showCartLinks ? "show" : ""}`}>
                                {post.productLinks.map((link, idx) => {
                                    const lowerUrl = link.url.toLowerCase();
                                    let platformLogo = "", platformName = "";
                                    if (lowerUrl.includes("shopee")) { platformLogo = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg"; platformName = "Shopee"; }
                                    else if (lowerUrl.includes("lazada")) { platformLogo = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Lazada_%282019%29.svg"; platformName = "Lazada"; }
                                    else if (lowerUrl.includes("apple")) { platformLogo = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"; platformName = "Apple"; }
                                    else { platformLogo = "https://cdn-icons-png.flaticon.com/512/126/126122.png"; platformName = "Shop"; }
                                    return <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="cart-item">
                                        <img src={platformLogo} alt={platformName} className="platform-logo" />
                                        <span>{platformName}</span>
                                    </a>;
                                })}
                            </div>
                        ) : null}
                    </div>

                    <button className={`icon-button bookmark-button ${bookmarked ? "bookmarked" : ""} ${bookmarkAnim ? "icon-animate-bookmark" : ""}`} onClick={handleBookmark}>
                        <Bookmark className="icon" />
                    </button>

                    <button className="icon-button share-button" onClick={handleShare}>
                        <Share2 className="icon" />
                    </button>

                    {/* Post Owner More */}
                    {isOwner && (
                        <div className="more-dropdown" ref={moreRef}>
                            <button className="icon-button more-button" onClick={() => setShowMoreMenu(!showMoreMenu)}>
                                <MoreHorizontal className="icon" />
                            </button>
                            {showMoreMenu && (
                                <div className="cart-menu show">
                                    <button className="cart-item delete-button" onClick={handleDeletePost}>Delete Post</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <hr />

            {/* Post Images + Blocks */}
            {post.images?.map((img, idx) => (
                <div key={idx} className="image-with-text">
                    <img src={img.url} alt={`Post image ${idx + 1}`} className="detail-image" />
                    {post.blocks?.[idx] && <p className="detail-block">{post.blocks[idx].data?.text || ""}</p>}
                </div>
            ))}

            {/* ------------------- Comments Section ------------------- */}
            {showComments && (
                <div className="comments-section">
                    <h3>Comments</h3>
                    <div className="comments-list">
                        {comments.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                postId={post._id}
                                token={token}
                                setComments={setComments}
                                API_URL={API_URL}
                            />
                        ))}
                        <div ref={commentsEndRef} />
                    </div>

                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <button className="send-button" onClick={handleAddComment}>Send</button>
                </div>
            )}
        </div>
    );
}

// ------------------- Comment Card -------------------
function CommentCard({
    comment,
    postId,
    token,
    setComments,
    API_URL,
}: {
    comment: Comment;
    postId: string;
    token: string | null;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    API_URL: string;
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);

    const handleEdit = async () => {
        if (!editedText.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/comments/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text: editedText }),
            });
            const data = await res.json();
            if (data.success) {
                setComments(prev =>
                    prev.map(c => (c._id === comment._id ? { ...c, text: editedText } : c))
                );
                setEditing(false);
            } else {
                alert(data.message || "แก้ไขคอมเมนต์ไม่สำเร็จ");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการแก้ไขคอมเมนต์");
        }
    };

    const handleDelete = async () => {
        if (!confirm("คุณแน่ใจว่าจะลบคอมเมนต์นี้?")) return;
        try {
            const res = await fetch(`${API_URL}/api/posts/${postId}/comments/${comment._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setComments(prev => prev.filter(c => c._id !== comment._id));
            } else {
                alert(data.message || "ลบคอมเมนต์ไม่สำเร็จ");
            }
        } catch (err) {
            console.error(err);
            alert("เกิดข้อผิดพลาดในการลบคอมเมนต์");
        }
    };




    return (
        <div className="comment-card">
            <div className="comment-header">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                        src={comment.avatarUrl || "https://placehold.co/40x40"}
                        alt={comment.username}
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                    />
                    <div>
                        <strong>{comment.username}</strong>
                        <div className="comment-date">
                            {new Date(comment.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true
                            })}
                        </div>
                    </div>
                </div>

                <div className="comment-menu-wrapper">
                    <button className="more-button" onClick={() => setShowMenu(!showMenu)}>
                        <MoreHorizontal className="icon" />
                    </button>
                    {showMenu && (
                        <div className="comment-menu show">
                            {!editing && <button onClick={() => setEditing(true)}>✏️</button>}
                            <button onClick={handleDelete}>🗑️</button>
                        </div>
                    )}
                </div>
            </div>

            {editing ? (
                <div className="edit-comment">
                    <textarea
                        value={editedText}
                        onChange={e => setEditedText(e.target.value)}
                    />
                    <button onClick={handleEdit}>บันทึก</button>
                    <button onClick={() => setEditing(false)}>ยกเลิก</button>
                </div>
            ) : (
                <p>{comment.text}</p>
            )}
        </div>
    );
}

