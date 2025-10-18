import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import axios from "axios";
import "./Styles/Write.css";

interface ProductLink {
  url: string;
  name?: string; 
}

interface Block {
  id: string;
  type: "paragraph" | "header";
  data: { text: string };
}

// NOTE: เราไม่จำเป็นต้องใช้ interface User ในหน้านี้แล้ว
// เพราะเราจะใช้ token ในการยืนยันตัวตนแทน
// interface User {
//  _id: string;
//  username: string;
// }

export default function Write() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("other");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "paragraph", data: { text: "" } },
  ]);
  const [productLinks, setProductLinks] = useState<ProductLink[]>([
    { url: "", name: "Unnamed product" },
  ]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ไม่จำเป็นต้องใช้ State ของ currentUser ในฟอร์มนี้แล้ว
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  // useEffect(() => {
  //   const storedUser = localStorage.getItem("currentUser");
  //   if (storedUser) {
  //     setCurrentUser(JSON.parse(storedUser));
  //   }
  // }, []);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);

    // เคลียร์ preview เก่าๆ ออกก่อน
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const handleBlockChange = (index: number, value: string) => {
    const updated = [...blocks];
    updated[index].data.text = value;
    setBlocks(updated);
  };

  const addParagraph = () => {
    setBlocks([
      ...blocks,
      { id: String(Date.now()), type: "paragraph", data: { text: "" } },
    ]);
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...productLinks];
    updated[index].url = value;
    updated[index].name = value || "Unnamed product"; 
    setProductLinks(updated);
  };

  const addLink = () => {
    setProductLinks([...productLinks, { url: "", name: "Unnamed product" }]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // --- ⭐ START: ส่วนที่แก้ไข ---

    // 1. ดึง Token จาก Local Storage (ไม่ใช่ currentUser)
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ You must be logged in to create a post. (Token not found)");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("category", category);
      formData.append("blocks", JSON.stringify(blocks));
      formData.append("productLinks", JSON.stringify(productLinks));
      images.forEach((file) => formData.append("images", file));

      // 2. ลบบรรทัดที่ส่ง userId ออก! เพราะ Backend จะหาเองจาก Token
      // formData.append("userId", currentUser._id); // <-- ลบบรรทัดนี้

      const response = await axios.post(`${import.meta.env.VITE_URL_API}/api/posts`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          // 3. เพิ่ม Authorization Header เพื่อส่ง Token ไปให้ Backend ตรวจสอบ
          "Authorization": `Bearer ${token}` 
        },
      });
      
      // --- ⭐ END: ส่วนที่แก้ไข ---

      setMessage("✅ Post created successfully!");
      console.log("Response:", response.data);

      // reset form
      setTitle("");
      setSubtitle("");
      setBlocks([{ id: "1", type: "paragraph", data: { text: "" } }]);
      setProductLinks([{ url: "", name: "Unnamed product" }]);
      setImages([]);
      setPreviewUrls([]);
    } catch (error: any) {
      setMessage("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        {/* ... ส่วนของ JSX ไม่มีการเปลี่ยนแปลง ... */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="tech">Tech</option>
          <option value="fashion">Fashion</option>
          <option value="food">Food</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="beauty">Beauty</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
        <div className="block-section">
          <h4>Content</h4>
          {blocks.map((block, index) => (
            <textarea
              key={block.id}
              placeholder="Write something..."
              value={block.data.text}
              onChange={(e) => handleBlockChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addParagraph} className="btn-secondary">
            + Add Paragraph
          </button>
        </div>
        <div className="product-links">
          <h4>Product Links</h4>
          {productLinks.map((link, index) => (
            <input
              key={index}
              type="text"
              placeholder="Product URL"
              value={link.url}
              onChange={(e) => handleLinkChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addLink} className="btn-secondary">
            + Add Link
          </button>
        </div>
        <div className="image-upload">
          <h4>Upload Images</h4>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="image-preview">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`preview-${idx}`} />
            ))}
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Publishing..." : "Publish Post"}
        </button>
        {message && <p className="status-message">{message}</p>}
      </form>
    </div>
  );
}