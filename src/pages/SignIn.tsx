import { useRef, useState, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_=+]).{8,24}$/;

const SignIn = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry. Please use the same credentials you successfully submitted on the Register page.");

      return;
    }
    console.log(user, pwd);
    navigate("/MainPage");
  };

  return (
    <>
      <section className="container-sm mt-5">
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          {/* START OF FORM */}
          <form>
            {/* username */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username:
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off"
                required
                className="form-control"
              />
            </div>

            {/* password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                required
                className="form-control"
              />
            </div>

            {/* Button */}
            <Button
              color="primary"
              onClick={handleSubmit}
              disabled={!user || !pwd}
            >
              Sign Up
            </Button>
          </form>
          {/* END OF FORM */}
          <p>
            <label className="form-label">Don't have an account?</label>
            <br />
            <span className="line">
              {/*put router link here*/}
              <Link to="/">Register here</Link>
            </span>
          </p>
        </section>
      </section>
    </>
  );
}

export default SignIn