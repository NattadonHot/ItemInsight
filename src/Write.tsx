import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Link as LinkIcon, Plus } from "lucide-react";

export default function Write() {
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("https://bookish-meme-694jwvprwwxjfrx5j-5000.app.github.dev/api/");
        const data = await res.json();
        setUsername(data.name);
      } catch (err) {
        console.error(err);
        setUsername("Unknown");
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="write-page" style={{ marginTop: 65, fontFamily: "Roboto, sans-serif" }}>
      <div
        className="draft-bar"
        style={{
          width: "100%",
          backgroundColor: "#3B82F6",
          textAlign: "center",
          padding: "10px 0",
          color: "white",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        {username ? `Draft by ${username}` : "Loading..."}
      </div>

      <div className="write-form" style={{ padding: "50px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Title"
              style={{
                width: "100%",
                fontSize: 26,
                fontWeight: 600,
                border: "none",
                outline: "none",
                background: "transparent",
              }}
            />
          </div>

          {/* Subtitle */}
          <input
            type="text"
            placeholder="Subtitle"
            style={{
              width: "100%",
              fontSize: 18,
              fontWeight: 500,
              border: "none",
              outline: "none",
              background: "transparent",
              marginBottom: 20,
              color: "#666",
            }}
          />

          {/* Description */}
          <textarea
            placeholder="Tell your story..."
            rows={6}
            style={{
              width: "100%",
              fontSize: 16,
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              color: "#555",
              marginBottom: 30,
            }}
          />

          {/* Button Menu */}
          <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: 35,
                height: 35,
                borderRadius: "50%",
                border: "1.5px solid #3B82F6",
                background: "white",
                color: "#3B82F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                marginBottom: 10
              }}
            >
              <motion.div animate={{ rotate: menuOpen ? 45 : 0 }}>
                <Plus size={20} />
              </motion.div>
            </button>
          {/* Upload Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 25,
                  justifyContent: "flex-start",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "1px solid #3B82F6",
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: "#3B82F6",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  <Image size={18} /> Upload Image
                </button>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    border: "1px solid #3B82F6",
                    borderRadius: 8,
                    padding: "6px 12px",
                    color: "#3B82F6",
                    background: "white",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  <LinkIcon size={18} /> Insert Link
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview placeholder */}
          <img
            src="https://placehold.co/600x300?text=Your+Upload"
            style={{
              width: "100%",
              borderRadius: 10,
              objectFit: "cover",
              marginBottom: 20,
            }}
          />

          {/* Publish Button */}
          <button
            style={{
              background: "#3B82F6",
              color: "white",
              fontWeight: 600,
              fontSize: 16,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              display: "block",
              margin: "20px auto 0",
            }}
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
