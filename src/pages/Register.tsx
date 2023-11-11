import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.css";
import Button from "../components/Button";
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_=+]).{8,24}$/;

const Register = () => {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLDivElement | null>(null);

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    // console.log(result);
    // console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    // console.log(result);
    // console.log(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    // console.log(result);
    // console.log(pwd);
    setValidPwd(result);

    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(user);
    const v2 = EMAIL_REGEX.test(email);
    const v3 = PWD_REGEX.test(pwd);
    const file = fileInputRef.current?.files?.[0];
    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    if (!file) {
      setErrMsg("Please select a file.");
      return;
    }

    // console.log(user, email, pwd);
    setSuccess(true);
  };

  return (
    <>
      <section className="container-sm mt-5">
        {success ? (
          <section>
            <h1>Success!</h1>
            <p>
              <Link to="/SignIn">Sign In</Link>
            </p>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1>Register</h1>
            {/* START OF FORM */}
            <form>
              {/* username */}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`custom-check-icon ${
                      validName ? "valid" : "hide"
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`custom-times-icon ${
                      validName || !user ? "hide" : "invalid"
                    }`}
                  />
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)} // input has focus
                  onBlur={() => setUserFocus(false)} // input doesn't have focus anymore
                  className="form-control"
                />
                <p
                  id="uidnote"
                  className={
                    userFocus && user && !validName
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              {/* email */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`custom-check-icon ${
                      validEmail ? "valid" : "hide"
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`custom-times-icon ${
                      validEmail || !email ? "hide" : "invalid"
                    }`}
                  />
                </label>
                <input
                  type="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="eidnote"
                  onFocus={() => setEmailFocus(true)} // input has focus
                  onBlur={() => setEmailFocus(false)} // input doesn't have focus anymore
                  className="form-control"
                />
                <p
                  id="eidnote"
                  className={
                    emailFocus && email && !validEmail
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must have an @ symbol followed by a domain name.
                  <br />
                  No spaces allowed.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              {/* password */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`custom-check-icon ${
                      validPwd ? "valid" : "hide"
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`custom-times-icon ${
                      validPwd || !pwd ? "hide" : "invalid"
                    }`}
                  />
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  className="form-control"
                />
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              </div>

              {/* match password */}
              <div className="mb-3">
                <label htmlFor="confirm_pwd" className="form-label">
                  Confirm Password:
                  <FontAwesomeIcon
                    icon={faCheck}
                    className={`custom-check-icon ${
                      validMatch && matchPwd ? "valid" : "hide"
                    }`}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={`custom-times-icon ${
                      validMatch || !matchPwd ? "hide" : "invalid"
                    }`}
                  />
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="form-control"
                />
                <p
                  id="confirmnote"
                  className={
                    matchFocus && !validMatch ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Must match the first password input field.
                </p>
              </div>

              {/* Upload Picture */}
              <div className="mb-3">
                <label htmlFor="display-pic" className="form-label">
                  Upload display picture:
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="display-pic"
                  required
                  ref={fileInputRef}
                />
              </div>

              {/* Button */}
              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={!validName || !validPwd || !validMatch}
              >
                Sign Up
              </Button>
            </form>
            {/* END OF FORM */}
            <p>
              <label className="form-label">Already registered?</label>
              <br />
              <span className="line">
                {/*put router link here*/}
                <Link to="/SignIn">Sign In</Link>
              </span>
            </p>
          </section>
        )}
      </section>
    </>
  );
};

export default Register;
