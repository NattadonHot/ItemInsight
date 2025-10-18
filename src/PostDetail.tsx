import { Heart, MessageCircle, ShoppingCart, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Styles/PostDetail.css";

interface Block {
    id?: string;
    type?: string;
    data?: {
        text?: string;
    };
}

interface ProductLink {
    name: string;
    url: string;
}

interface UserInfo {
    username?: string;
    avatarUrl?: string;
}

interface Post {
    _id: string;
    title: string;
    subtitle?: string;
    userId?: UserInfo;
    createdAt: string;
    images?: { url: string }[];
    blocks?: Block[];
    productLinks?: ProductLink[];
}


export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_URL = import.meta.env.VITE_URL_API;
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(61);
    const [bookmarked, setBookmarked] = useState(false);
    const [comments] = useState(61);

    const [showCartLinks, setShowCartLinks] = useState(false);
    const cartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/api/posts/${id}`);
                const result = await response.json();
                if (result.success) setPost(result.data as Post);
                else setError(result.message || "Failed to fetch post");
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
                setShowCartLinks(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            const shareBtn = document.querySelector(".share-button");
            shareBtn?.classList.add("shake");
            setTimeout(() => shareBtn?.classList.remove("shake"), 500);
            alert("ลิงก์ถูกคัดลอกแล้ว ✅");
        } catch (err) {
            console.error("ไม่สามารถคัดลอกลิงก์ได้", err);
        }
    };

    if (loading) return <p className="loading">Loading post...</p>;
    if (error) return <p className="error">❌ {error}</p>;
    if (!post) return <p className="not-found">Post not found.</p>;

    return (
        <div className="detail-container">
            <h2 className="detail-title">{post.title}</h2>
            {post.subtitle && <p className="detail-subtitle">{post.subtitle}</p>}

            <div className="detail-user">
                <img src={post.userId?.avatarUrl || "https://placehold.co/40x40"} alt="User avatar" className="detail-avatar" />
                <span className="detail-username">{post.userId?.username || "Anonymous"}</span>
                <span className="detail-date">
                    {new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(post.createdAt))}
                </span>
            </div>

            <hr />

            <div className="action-icons-wrapper">
                <div className="action-icons-left">
                    <button
                        className={`icon-button like-button ${liked ? "liked" : ""}`}
                        onClick={() => {
                            setLiked(!liked);
                            setLikes(liked ? likes - 1 : likes + 1);
                        }}
                    >
                        <Heart className="icon" />
                        <span>{likes} likes</span>
                    </button>

                    <button className="icon-button">
                        <MessageCircle className="icon" />
                        <span>{comments}</span>
                    </button>
                </div>

                <div className="action-icons-right">
                    <div className={`cart-dropdown ${showCartLinks ? "show" : ""}`} ref={cartRef}>
                        <button
                            className="icon-button cart-button"
                            onClick={() => setShowCartLinks(!showCartLinks)}
                        >
                            <ShoppingCart className="icon" />
                        </button>

                        {showCartLinks && post.productLinks && post.productLinks.length > 0 && (
                            <div className="cart-menu">
                                {post.productLinks.map((link, idx) => {
                                    const lowerUrl = link.url.toLowerCase();
                                    let platformLogo = "";
                                    let platformName = "";

                                    if (lowerUrl.includes("shopee")) {
                                        platformLogo = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg";
                                        platformName = "Shopee";
                                    } else if (lowerUrl.includes("lazada")) {
                                        platformLogo = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Lazada_%282019%29.svg";
                                        platformName = "Lazada";
                                    } else if (lowerUrl.includes("apple")) {
                                        platformLogo = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg";
                                        platformName = "Apple";
                                    } else {
                                        platformLogo = "https://cdn-icons-png.flaticon.com/512/126/126122.png";
                                        platformName = "Shop";
                                    }

                                    return (
                                        <a
                                            key={idx}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="cart-item"
                                        >
                                            <img
                                                src={platformLogo}
                                                alt={platformName}
                                                className="platform-logo"
                                            />
                                            <span>{platformName}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    <button
                        className={`icon-button bookmark-button ${bookmarked ? "bookmarked" : ""}`}
                        onClick={() => setBookmarked(!bookmarked)}
                    >
                        <Bookmark className="icon" />
                    </button>

                    <button className="icon-button share-button" onClick={handleShare}>
                        <Share2 className="icon" />
                    </button>

                    <button className="icon-button">
                        <MoreHorizontal className="icon" />
                    </button>
                </div>
            </div>

            <hr />

            {post.images?.map((img, idx) => (
                <div key={idx} className="image-with-text">
                    <img src={img.url} alt={`Post image ${idx + 1}`} className="detail-image" />
                    {post.blocks?.[idx] && (
                        <p className="detail-block">{post.blocks[idx].data?.text || ""}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
