import "../Styles/Login.css";

function Login() {
  return (
    <div className="login-container">
      <h1 className="logo">
        <span className="logo-dark">Item</span>
        <span className="logo-orange">Insight</span>
      </h1>

      <form className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" />

        <button type="button" className="btn-login">LOGIN</button>
        <p className="signup-link">Signup</p>
      </form>
    </div>
  );
}

export default Login;
