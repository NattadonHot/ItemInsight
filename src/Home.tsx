import { useState, useEffect } from "react";
import PostCard from "./Components/PostCard"; // import path ให้ตรงกับไฟล์จริง

export default function Home() {
  const [activeTab, setActiveTab] = useState("For you");
  const tabs = ["For you", "Fashion", "Skincare"];

  useEffect(() => {
    document.title = "Home - ItemInsight";
  }, []);

  // สร้างตัวอย่าง post สำหรับโชว์
  const samplePost = {
    id: 1,
    title: "Classic White Sneakers",
    description: "Comfortable and stylish white sneakers perfect for everyday wear.",
    username: "Patchara",
    userProfile: "https://placehold.co/30x30",
    image: "https://placehold.co/120x120",
    likes: 10,
    isLiked: false,
    isFavorited: false,
    isBookmarked: false,
  };

  return (
    <div
      className="home-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <p>Hello World</p>

      <div
        className="tabs"
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            style={{
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: activeTab === tab ? "black" : "gray",
              position: "relative",
              cursor: "pointer",
            }}
          >
            {tab}
            {activeTab === tab && (
              <div
                style={{
                  height: "2px",
                  backgroundColor: "black",
                  position: "absolute",
                  bottom: "-5px",
                  left: 0,
                  right: 0,
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "30px", width: "100%", maxWidth: "600px" }}>
        {activeTab === "For you" && <PostCard post={samplePost} />}
        {activeTab === "Fashion" && <PostCard post={samplePost} />}
        {activeTab === "Skincare" && <PostCard post={samplePost} />}
      </div>
    </div>
  );
}
