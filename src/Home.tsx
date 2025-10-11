import { useState } from "react";

export default function Home() {
    const [activeTab, setActiveTab] = useState("For you");

    const tabs = ["For you", "Fashion", "Skincare"];

    return (
        <div className="home-container" style={{ padding: "20px" }}>
            <div className="tabs" style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
                {tabs.map((tab) => (
                    <div
                        key={tab}
                        className={`tab ${activeTab === tab ? "active" : ""}`}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            fontWeight: activeTab === tab ? "bold" : "normal",
                            color: activeTab === tab ? "black" : "gray",
                            position: "relative",
                            cursor: "pointer"
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
                                    right: 0
                                }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "30px" }}>
                {activeTab === "For you" && <p>นี่คือหน้า For you</p>}
                {activeTab === "Fashion" && <p>นี่คือหน้า Fashion</p>}
                {activeTab === "Skincare" && <p>นี่คือหน้า Skincare</p>}
            </div>
        </div>
    );
}
