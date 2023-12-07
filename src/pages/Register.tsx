import { useRef, useState, useEffect, ChangeEvent } from "react";
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_=+]).{8,24}$/;

const Register = () => {
  const firstNameRef = useRef<HTMLInputElement | null>(null);
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

  const [selectedUserType, setSelectedUserType] = useState("mhp");
  const [notVerifiedProfessional, setNotVerifiedProfessional] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(true);

  // mental health professional verification
  const licenseNumberRef = useRef<HTMLInputElement | null>(null);

  const [validLicenseNumber, setValidLicenseNumber] = useState(false);
  const [validDisordersSpecialization, setValidDisordersSpecialization] =
    useState(false);
  const [validFees, setValidFees] = useState(false);
  const [validYearsOfExperience, setValidYearsOfExperience] = useState(false);
  const [validMinimumAge, setValidMinimumAge] = useState(false);
  const [validMaximumAge, setValidMaximumAge] = useState(false);
  const [validLanguages, setValidLanguages] = useState(false);
  const [validAvailableDays, setValidAvailableDays] = useState(false);
  const [validAvailableHours, setValidAvailableHours] = useState(false);
  const [validContactNumber, setValidContactNumber] = useState(false);

  useEffect(() => {
    firstNameRef.current?.focus();
    licenseNumberRef.current?.focus();
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

  const handleUserTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedUserType(e.target.value);
  };

  // mental health professional verification
  const disordersSpecializationCheckboxes = document.getElementById(
    "disordersSpecializationCheckboxes"
  );

  if (disordersSpecializationCheckboxes) {
    // Select all checkboxes within the disordersSpecializationCheckboxes
    const checkboxes =
      disordersSpecializationCheckboxes.querySelectorAll(".form-check-input");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        setValidDisordersSpecialization(
          Array.from(checkboxes).some((cb) => (cb as HTMLInputElement).checked)
        );
      });
    });
  } else {
    console.error(
      "Element with id 'disordersSpecializationCheckboxes' not found."
    );
  }

  const feesCheckboxes = document.getElementById("feesCheckboxes");

  if (feesCheckboxes) {
    // Select all checkboxes within the feesCheckboxes
    const checkboxes = feesCheckboxes.querySelectorAll(".form-check-input");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        setValidFees(
          Array.from(checkboxes).some((cb) => (cb as HTMLInputElement).checked)
        );
      });
    });
  } else {
    console.error("Element with id 'feesCheckboxes' not found.");
  }

  const availableDaysCheckboxes = document.getElementById(
    "availableDaysCheckboxes"
  );

  if (availableDaysCheckboxes) {
    // Select all checkboxes within the availableDaysCheckboxes
    const checkboxes =
      availableDaysCheckboxes.querySelectorAll(".form-check-input");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        setValidAvailableDays(
          Array.from(checkboxes).some((cb) => (cb as HTMLInputElement).checked)
        );
      });
    });
  } else {
    console.error("Element with id 'availableDaysCheckboxes' not found.");
  }

  const availableHoursCheckboxes = document.getElementById(
    "availableHoursCheckboxes"
  );

  if (availableHoursCheckboxes) {
    // Select all checkboxes within the availableHoursCheckboxes
    const checkboxes =
      availableHoursCheckboxes.querySelectorAll(".form-check-input");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        setValidAvailableHours(
          Array.from(checkboxes).some((cb) => (cb as HTMLInputElement).checked)
        );
      });
    });
  } else {
    console.error("Element with id 'availableHoursCheckboxes' not found.");
  }

  // submit buttons
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

    const firstName = (document.querySelector("#firstName") as HTMLInputElement)
      .value;
    const middleName = (
      document.querySelector("#middleName") as HTMLInputElement | null
    )?.value;
    const lastName = (document.querySelector("#lastName") as HTMLInputElement)
      .value;
    const age = (document.querySelector("#age") as HTMLInputElement).value;
    const gender = (
      document.querySelector("#gender") as HTMLSelectElement | null
    )?.value;
    const pronouns = (
      document.querySelector("#pronouns") as HTMLInputElement | null
    )?.value;

    if (parseInt(age, 10) <= 0) {
      setErrMsg("Please enter a valid age.");
      return;
    }

    const formData = new FormData();

    formData.append("Username", user);
    formData.append("Email", email);
    formData.append("Password", pwd);
    formData.append("avatar_url", file);
    formData.append("Role", selectedUserType);
    formData.append(
      "register_date",
      new Date().toISOString().slice(0, 19).replace("T", " ")
    );
    formData.append("State", "Active");
    formData.append("first_name", firstName);
    formData.append("middle_name", middleName || "n/a");
    formData.append("last_name", lastName);
    formData.append("age", age);
    formData.append("gender", gender || "n/a");
    formData.append("pronouns", pronouns || "n/a");

    // Make a request here to /api/users to get the record with the inputted user (if it exists)
    try {
      const response = await fetch(
        `http://localhost:3001/api/username_check/${user}`
      );

      if (response.ok) {
        console.log("This is a unique username.");
      } else {
        console.error("This username already exists.");
        setErrMsg("This username already exists.");

        return;
      }
    } catch (error) {
      console.error("Error during GET request:", error);
      setErrMsg("Error during GET request:");

      return;
    }

    // Make a request here to /api/users to get the record with the inputted email (if it exists)
    try {
      const response = await fetch(
        `http://localhost:3001/api/email_check/${email}`
      );

      if (response.ok) {
        console.log("This is a unique email.");
      } else {
        console.error("This email already exists.");
        setErrMsg("This email already exists.");

        return;
      }
    } catch (error) {
      console.error("Error during GET request:", error);
      setErrMsg("Error during GET request:");

      return;
    }

    // add data to database
    try {
      // Make a POST request to server endpoint
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("User added successfully!");
      } else {
        console.error("Failed to add user to the database");
        setErrMsg("Failed to add user to the database");

        return;
      }
    } catch (error) {
      console.error("Error during POST request:", error);
      setErrMsg("Error during POST request:");

      return;
    }

    // firebase
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pwd);

      // user.png, yaskween.png, ladyneneii.png
      const storageRef = ref(storage, user);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErrMsg("Error uploading display picture.");
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName: user,
              photoURL: downloadURL,
            });
          });
        }
      );

      console.log("Avatar uploaded successfully.");
      // console.log(user, email, pwd);
      setSuccess(true);
    } catch (err) {
      setErrMsg("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <section className="container-sm mt-5">
        {success ? (
          selectedUserType !== "nmhp" && notVerifiedProfessional ? (
            // Mental Health Professional Verification
            <form>
              {/* license number */}
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  License Number:
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  ref={licenseNumberRef}
                  onChange={() => setValidLicenseNumber(true)}
                  required
                  className="form-control"
                />
              </div>

              {/* disorders specialization */}
              <div className="mb-3" id="disordersSpecializationCheckboxes">
                <label htmlFor="middleName" className="form-label">
                  Disorders Specialization:
                </label>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="anxiety-disorders"
                    id="anxiety-disorders"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="anxiety-disorders"
                  >
                    Anxiety Disorders
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="eating-disorders"
                    id="eating-disorders"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="eating-disorders"
                  >
                    Eating Disorders
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="bipolar-affective-disorder"
                    id="bipolar-affective-disorder"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="bipolar-affective-disorder"
                  >
                    Bipolar Affective Disorder
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="depression"
                    id="depression"
                  />
                  <label className="form-check-label" htmlFor="depression">
                    Depression
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="dissociation-and-dissociative-disorders"
                    id="dissociation-and-dissociative-disorders"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="dissociation-and-dissociative-disorders"
                  >
                    Dissociation and Dissociative Disorders
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="eating-disorders"
                    id="eating-disorders"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="eating-disorders"
                  >
                    Eating Disorders
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="obsessive-compulsive-disorder"
                    id="obsessive-compulsive-disorder"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="obsessive-compulsive-disorder"
                  >
                    Obsessive-Compulsive Disorder (OCD)
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="paranoia"
                    id="paranoia"
                  />
                  <label className="form-check-label" htmlFor="paranoia">
                    Paranoia
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="post-traumatic-stress-disorder"
                    id="post-traumatic-stress-disorder"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="post-traumatic-stress-disorder"
                  >
                    Post-Traumatic Stress Disorder (PTSD)
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="psychosis"
                    id="psychosis"
                  />
                  <label className="form-check-label" htmlFor="psychosis">
                    Psychosis
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="schizophrenia"
                    id="schizophrenia"
                  />
                  <label className="form-check-label" htmlFor="schizophrenia">
                    Schizophrenia
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value="neurodevelopmental-disorders"
                    id="neurodevelopmental-disorders"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="neurodevelopmental-disorders"
                  >
                    Neurodevelopmental Disorders
                  </label>
                </div>
              </div>

              {/* fees */}
              <div className="row" id="feesCheckboxes">
                <label htmlFor="middleName" className="form-label">
                  Fees:
                </label>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="0-500"
                      id="fees-0-500"
                    />
                    <label className="form-check-label" htmlFor="fees-0-500">
                      ₱0-₱500
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="500-1000"
                      id="fees-500-1000"
                    />
                    <label className="form-check-label" htmlFor="fees-500-1000">
                      ₱500-₱1000
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1000-1500"
                      id="fees-1000-1500"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-1000-1500"
                    >
                      ₱1000-₱1500
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1500-2000"
                      id="fees-1500-2000"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-1500-2000"
                    >
                      ₱1500-₱2000
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="2000-2500"
                      id="fees-2000-2500"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-2000-2500"
                    >
                      ₱2000-₱2500
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="2500-3000"
                      id="fees-2500-3000"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-2500-3000"
                    >
                      ₱2500-₱3000
                    </label>
                  </div>
                </div>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="3000-3500"
                      id="fees-3000-3500"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-3000-3500"
                    >
                      ₱3000-₱3500
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="3500-4000"
                      id="fees-3500-4000"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-3500-4000"
                    >
                      ₱3500-₱4000
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="4000-4500"
                      id="fees-4000-4500"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-4000-4500"
                    >
                      ₱4000-₱4500
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="4500-5000"
                      id="fees-4500-5000"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-4500-5000"
                    >
                      ₱4500-₱5000
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="5000-above"
                      id="fees-5000-above"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fees-5000-above"
                    >
                      ₱5000 and above
                    </label>
                  </div>
                </div>
              </div>

              <div className="row">
                {/* years of experience */}
                <div className="mb-3 col">
                  <label className="form-label">Years of Experience:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="yearsOfExperience"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setValidYearsOfExperience(false)
                        : setValidYearsOfExperience(true);
                    }}
                    required
                  />
                </div>

                {/* minimum age */}
                <div className="mb-3 col">
                  <label className="form-label">Minimum Age:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="minimumAge"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setValidMinimumAge(false)
                        : setValidMinimumAge(true);
                    }}
                    required
                  />
                </div>

                {/* maximum age */}
                <div className="mb-3 col">
                  <label className="form-label">Maximum Age:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="maximumAge"
                    onChange={(e) => {
                      e.target.value === ""
                        ? setValidMaximumAge(false)
                        : setValidMaximumAge(true);
                    }}
                    required
                  />
                </div>
              </div>

              {/* languaes spoken */}
              <div className="mb-3">
                <label className="form-label">
                  Languages (separate by a comma and space):
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="languages"
                  placeholder="English, Filipino, Bisaya"
                  onChange={(e) => {
                    e.target.value === ""
                      ? setValidLanguages(false)
                      : setValidLanguages(true);
                  }}
                  required
                />
              </div>

              {/* available days */}
              <div className="row" id="availableDaysCheckboxes">
                <label htmlFor="middleName" className="form-label">
                  Available Days:
                </label>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="sunday"
                      id="sunday"
                    />
                    <label className="form-check-label" htmlFor="sunday">
                      Sunday
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="monday"
                      id="monday"
                    />
                    <label className="form-check-label" htmlFor="monday">
                      Monday
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="tuesday"
                      id="tuesday"
                    />
                    <label className="form-check-label" htmlFor="tuesday">
                      Tuesday
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="wednesday"
                      id="wednesday"
                    />
                    <label className="form-check-label" htmlFor="wednesday">
                      Wednesday
                    </label>
                  </div>
                </div>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="thursday"
                      id="thursday"
                    />
                    <label className="form-check-label" htmlFor="thursday">
                      Thursday
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="friday"
                      id="friday"
                    />
                    <label className="form-check-label" htmlFor="friday">
                      Friday
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="saturday"
                      id="saturday"
                    />
                    <label className="form-check-label" htmlFor="saturday">
                      Saturday
                    </label>
                  </div>
                </div>
              </div>

              {/* available hours */}
              <div className="row" id="availableHoursCheckboxes">
                <label htmlFor="middleName" className="form-label">
                  Available Hours:
                </label>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="12:00AM"
                      id="hours-12:00AM"
                    />
                    <label className="form-check-label" htmlFor="12:00AM">
                      12:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1:00AM"
                      id="hours-1:00AM"
                    />
                    <label className="form-check-label" htmlFor="1:00AM">
                      1:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="2:00AM"
                      id="hours-2:00AM"
                    />
                    <label className="form-check-label" htmlFor="2:00AM">
                      2:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="3:00AM"
                      id="hours-3:00AM"
                    />
                    <label className="form-check-label" htmlFor="3:00AM">
                      3:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="4:00AM"
                      id="hours-4:00AM"
                    />
                    <label className="form-check-label" htmlFor="4:00AM">
                      4:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="5:00AM"
                      id="hours-5:00AM"
                    />
                    <label className="form-check-label" htmlFor="5:00AM">
                      5:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="6:00AM"
                      id="hours-6:00AM"
                    />
                    <label className="form-check-label" htmlFor="6:00AM">
                      6:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="7:00AM"
                      id="hours-7:00AM"
                    />
                    <label className="form-check-label" htmlFor="7:00AM">
                      7:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="8:00AM"
                      id="hours-8:00AM"
                    />
                    <label className="form-check-label" htmlFor="8:00AM">
                      8:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="9:00AM"
                      id="hours-9:00AM"
                    />
                    <label className="form-check-label" htmlFor="9:00AM">
                      9:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="10:00AM"
                      id="hours-10:00AM"
                    />
                    <label className="form-check-label" htmlFor="10:00AM">
                      10:00 AM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="11:00AM"
                      id="hours-11:00AM"
                    />
                    <label className="form-check-label" htmlFor="11:00AM">
                      11:00 AM
                    </label>
                  </div>
                </div>

                <div className="mb-3 col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="12:00PM"
                      id="hours-12:00PM"
                    />
                    <label className="form-check-label" htmlFor="12:00PM">
                      12:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="1:00PM"
                      id="hours-1:00PM"
                    />
                    <label className="form-check-label" htmlFor="1:00PM">
                      1:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="2:00PM"
                      id="hours-2:00PM"
                    />
                    <label className="form-check-label" htmlFor="2:00PM">
                      2:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="3:00PM"
                      id="hours-3:00PM"
                    />
                    <label className="form-check-label" htmlFor="3:00PM">
                      3:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="4:00PM"
                      id="hours-4:00PM"
                    />
                    <label className="form-check-label" htmlFor="4:00PM">
                      4:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="5:00PM"
                      id="hours-5:00PM"
                    />
                    <label className="form-check-label" htmlFor="5:00PM">
                      5:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="6:00PM"
                      id="hours-6:00PM"
                    />
                    <label className="form-check-label" htmlFor="6:00PM">
                      6:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="7:00PM"
                      id="hours-7:00PM"
                    />
                    <label className="form-check-label" htmlFor="7:00PM">
                      7:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="8:00PM"
                      id="hours-8:00PM"
                    />
                    <label className="form-check-label" htmlFor="8:00PM">
                      8:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="9:00PM"
                      id="hours-9:00PM"
                    />
                    <label className="form-check-label" htmlFor="9:00PM">
                      9:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="10:00PM"
                      id="hours-10:00PM"
                    />
                    <label className="form-check-label" htmlFor="10:00PM">
                      10:00 PM
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value="11:00PM"
                      id="hours-11:00PM"
                    />
                    <label className="form-check-label" htmlFor="11:00PM">
                      11:00 PM
                    </label>
                  </div>
                </div>
              </div>

              {/* Contact Number */}
              <div className="mb-3">
                <label htmlFor="contactNumber" className="form-label">
                  Contact Number:
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  required
                  className="form-control"
                  placeholder="Add as many as you can. Any format will do."
                  onChange={(e) => {
                    e.target.value === ""
                      ? setValidContactNumber(false)
                      : setValidContactNumber(true);
                  }}
                />
              </div>

              {/* Notes */}
              <div className="form-floating mb-3">
                <textarea
                  className="form-control"
                  placeholder="Leave additional information here"
                  id="floatingTextarea"
                ></textarea>
                <label htmlFor="floatingTextarea">
                  Leave additional information here:
                </label>
              </div>

              <Button
                color="primary"
                onClick={handleSubmit}
                disabled={
                  !validLicenseNumber ||
                  !validDisordersSpecialization ||
                  !validFees ||
                  !validYearsOfExperience ||
                  !validMinimumAge ||
                  !validMaximumAge ||
                  !validLanguages ||
                  !validAvailableDays ||
                  !validAvailableHours ||
                  !validContactNumber
                }
              >
                Verify Professional Account
              </Button>
            </form>
          ) : (
            // Success message for both nmhp and mhp
            <section>
              <h1>Welcome to Padayon!</h1>
              <p>
                <Link to="/SignIn">Sign In</Link>
              </p>
            </section>
          )
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
              {/* first name */}
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  First Name:
                </label>
                <input
                  type="text"
                  id="firstName"
                  ref={firstNameRef}
                  required
                  className="form-control"
                />
              </div>

              {/* middle name */}
              <div className="mb-3">
                <label htmlFor="middleName" className="form-label">
                  Middle Name:
                </label>
                <input
                  type="text"
                  id="middleName"
                  className="form-control"
                  placeholder="Skip if you don't have any."
                />
              </div>

              {/* last name */}
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  Last Name:
                </label>
                <input
                  type="text"
                  id="lastName"
                  required
                  className="form-control"
                />
              </div>

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

              {/* Mental health professional or not */}
              <div className="mb-3">
                <label htmlFor="user-type" className="form-label">
                  Type of User:
                </label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userType"
                    id="nmhp"
                    value="nmhp"
                    checked={selectedUserType === "nmhp"}
                    onChange={handleUserTypeChange}
                  />
                  <label className="form-check-label" htmlFor="nmhp_label">
                    I am not a mental health professional.
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="userType"
                    id="mhp"
                    value="mhp"
                    checked={selectedUserType === "mhp"}
                    onChange={handleUserTypeChange}
                  />
                  <label className="form-check-label" htmlFor="mhp_label">
                    I am a mental health professional.
                  </label>
                </div>
              </div>

              {/* age, gender, pronouns */}
              <div className="row">
                <div className="mb-3 col">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    required
                  />
                </div>

                <div className="mb-3 col">
                  <label className="form-label">Gender</label>
                  <select className="form-select" id="gender" defaultValue="">
                    <option value="" disabled>
                      Select your gender
                    </option>
                    <option value="Woman">Woman</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Man">Man</option>
                    <option value="Others">Others</option>
                    <option value="PNTS">Prefer Not to Say</option>
                  </select>
                </div>

                <div className="mb-3 col">
                  <label className="form-label">Pronouns</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pronouns"
                    placeholder="e.g. she/her, he/him, they/them, etc."
                  />
                </div>
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
