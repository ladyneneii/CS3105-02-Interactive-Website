import { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_=+]).{8,24}$/;

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLDivElement | null>(null);

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg(
        "Invalid Entry. Please use the same credentials you successfully submitted on the Register page."
      );

      return;
    }
    // console.log(email, pwd);
    localStorage.setItem("email", email);
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
            {/* email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                id="email"
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={!email || !pwd}
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
};

export default SignIn;
