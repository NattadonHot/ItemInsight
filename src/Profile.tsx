function Profile() {
    return (
        <div className="profile-container"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "100px"
            }}
        >
            <img src="https://placehold.co/170x170" style={{ borderRadius: "50%", objectFit: "cover" }} />
            <button type="button" className="btn-upload"
                style={{
                    width: 95,
                    height: 40,
                    marginTop: "30px",
                    borderRadius: "15",
                    borderColor: "#3B82F6",
                    backgroundColor: "#F9FAFB",
                    color: "#3B82F6",
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    fontWeight: '600',
                    wordWrap: 'break-word',
                    cursor: "pointer"
                }}
            >Upload
            </button>
            <form className="profile-form">
                <div className="name-input" style={{ marginTop: "30px" }}>
                    <label htmlFor="name" style={{ fontSize: 22, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word', }}>Name</label><br></br>
                    <input type="text" id="name"
                        style={{
                            width: 400,
                            height: 40,
                            border: "2px solid #3B82F6",
                            backgroundColor: "#F9FAFB",
                            paddingLeft: "10px"
                        }}
                        placeholder="User0001"
                    /></div>

                <div className="passwd-input" style={{ marginTop: "30px" }}>
                    <label htmlFor="passwd" style={{ fontSize: 22, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word', }}>Password</label><br />
                    <input type="password" id="passwd"
                        style={{
                            width: 400,
                            height: 40,
                            border: "2px solid #3B82F6",
                            backgroundColor: "#F9FAFB",
                            paddingLeft: "10px"
                        }}
                        placeholder="********"
                    />
                    <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "12px", color: "gray", cursor: "pointer" }}>
                            change password
                        </span>
                    </div>
                </div>


                <div className="bio-input" style={{ marginTop: "10px" }}>
                    <label htmlFor="bio" style={{ fontSize: 22, fontFamily: 'Poppins', fontWeight: '600', wordWrap: 'break-word', }}>Short bio</label><br />
                    <textarea id="bio"
                        style={{
                            width: 400,
                            height: 112,
                            border: "2px solid #3B82F6",
                            backgroundColor: "#F9FAFB",
                            paddingLeft: "10px"
                        }}
                    />
                </div>
            </form>
            <button type="button" className="btn-done"
                style={{
                    width: 95,
                    height: 40,
                    marginTop: "40px",
                    borderRadius: "15px",
                    border: "2px solid #F9FAFB ",
                    backgroundColor: "#3B82F6",
                    fontSize: 16,
                    fontFamily: 'Poppins',
                    fontWeight: '600',
                    wordWrap: 'break-word',
                    color: "#F9FAFB",
                    cursor: "pointer"

                }}
            >Done</button>
            
        </div>
    );
}
export default Profile;