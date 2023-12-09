import { useRef, useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const MHPFormPage = () => {
  const navigate = useNavigate();
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
    licenseNumberRef.current?.focus();
  }, []);

  const [licenseNumber, setLicenseNumber] = useState("");

  const handleLicenseNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLicenseNumber = e.target.value;
    setLicenseNumber(newLicenseNumber);
    setValidLicenseNumber(newLicenseNumber.length === 0 ? false : true);
  };

  const [yearsOfExperience, setYearsOfExperience] = useState("");

  const handleYearsOfExperience = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYearsOfExperience = e.target.value;
    setYearsOfExperience(newYearsOfExperience);
    setValidYearsOfExperience(newYearsOfExperience.length === 0 ? false : true);
  };

  const [minimumAge, setMinimumAge] = useState("");

  const handleMinimumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinimumAge = e.target.value;
    setMinimumAge(newMinimumAge);
    setValidMinimumAge(newMinimumAge.length === 0 ? false : true);
  };

  const [maximumAge, setMaximumAge] = useState("");

  const handleMaximumAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMaximumAge = e.target.value;
    setMaximumAge(newMaximumAge);
    setValidMaximumAge(newMaximumAge.length === 0 ? false : true);
  };

  const [languages, setLanguages] = useState("");

  const handleLanguages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguages = e.target.value;
    setLanguages(newLanguages);
    setValidLanguages(newLanguages.length === 0 ? false : true);
  };

  const [contactNumber, setContactNumber] = useState("");

  const handleContactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContactNumber = e.target.value;
    setContactNumber(newContactNumber);
    setValidContactNumber(newContactNumber.length === 0 ? false : true);
  };

  const [notes, setNotes] = useState("");

  const handleNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
  };

  // CHECKBOXES
  // Array to store the values of checked checkboxes
  const [disordersSpecializationArr, setDisordersSpecializationArr] = useState<
    string[]
  >([]);

  const handleDisordersSpecializationCheckboxesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputCheckbox = event.target as HTMLInputElement;
    const value = inputCheckbox.value;

    setDisordersSpecializationArr((prevValues) => {
      const updatedValues = inputCheckbox.checked
        ? [...prevValues, value]
        : prevValues.filter((val) => val !== value);

      setValidDisordersSpecialization(updatedValues.length > 0 ? true : false);

      return updatedValues;
    });
  };

  const [feesArr, setFeesArr] = useState<string[]>([]);

  const handleFeesCheckboxesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputCheckbox = event.target as HTMLInputElement;
    const value = inputCheckbox.value;

    setFeesArr((prevValues) => {
      const updatedValues = inputCheckbox.checked
        ? [...prevValues, value]
        : prevValues.filter((val) => val !== value);

      setValidFees(updatedValues.length > 0 ? true : false);

      return updatedValues;
    });
  };

  const [availableDaysArr, setAvailableDaysArr] = useState<string[]>([]);

  const handleAvailableDaysCheckboxesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputCheckbox = event.target as HTMLInputElement;
    const value = inputCheckbox.value;

    setAvailableDaysArr((prevValues) => {
      const updatedValues = inputCheckbox.checked
        ? [...prevValues, value]
        : prevValues.filter((val) => val !== value);

      setValidAvailableDays(updatedValues.length > 0 ? true : false);

      return updatedValues;
    });
  };

  const [availableHoursArr, setAvailableHoursArr] = useState<string[]>([]);

  const handleAvailableHoursCheckboxesChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputCheckbox = event.target as HTMLInputElement;
    const value = inputCheckbox.value;

    setAvailableHoursArr((prevValues) => {
      const updatedValues = inputCheckbox.checked
        ? [...prevValues, value]
        : prevValues.filter((val) => val !== value);

      setValidAvailableHours(updatedValues.length > 0 ? true : false);

      return updatedValues;
    });
  };

  const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (parseInt(minimumAge, 10) < 0 || parseInt(maximumAge, 10) < 0) {
      alert("Please enter a valid age.");
      return;
    }
    if (parseInt(minimumAge, 10) > parseInt(maximumAge, 10)) {
      alert("Maximum age must be bigger than or equal to minimum age.");
      return;
    }

    // TODO: Check if licenseNumber already exists

    const disordersSpecialization: string =
      disordersSpecializationArr.join(", ");
    const fees: string = feesArr.join(", ");
    const availableDays: string = availableDaysArr.join(", ");
    const availableHours: string = availableHoursArr.join(", ");

    // Retrieve the user_details string from localStorage
    const user_details_str = localStorage.getItem("user_details");

    if (user_details_str) {
      const user_details = JSON.parse(user_details_str);
      const user_id = user_details.user_id;
      const formData = new FormData();

      formData.append("license_number", licenseNumber);
      formData.append("user_id", user_id);
      formData.append("disorders_specializations", disordersSpecialization);
      formData.append("Fees", fees);
      formData.append("years_of_experience", yearsOfExperience);
      formData.append("Languages", languages);
      formData.append("min_age", minimumAge);
      formData.append("max_age", maximumAge);
      formData.append("contact_number", contactNumber);
      formData.append("Notes", notes);
      formData.append("State", "open");
      formData.append("available_days", availableDays);
      formData.append("available_hours", availableHours);

      // add data to database
      try {
        const response = await fetch("http://localhost:3001/api/mhps", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          // Update user State from Unverified to Active
          const user_details_str = localStorage.getItem("user_details");

          if (user_details_str) {
            const user_details = JSON.parse(user_details_str);
            user_details.State = "Active";
            localStorage.setItem("user_details", JSON.stringify(user_details));

            console.log("State updated successfully in local storage");
            navigate("/MainPage");
          } else {
            console.log("user_details not found in local storage.");
          }
        } else {
          console.error("Failed to add user to the database");

          return;
        }
      } catch (error) {
        console.error("Error during POST request:", error);

        return;
      }
    } else {
      console.log("user_id not found in localstorage.");
    }

    // Make a request here to /api/users to get the record with the inputted user (if it exists)
    // try {
    //   const response = await fetch(
    //     `http://localhost:3001/api/license_number_check/${user}`
    //   );

    //   if (response.ok) {
    //     console.log("This is a unique license number.");
    //   } else {
    //     console.error("This license number already exists.");

    //     return;
    //   }
    // } catch (error) {
    //   console.error("Error during GET request:", error);

    //   return;
    // }
  };

  return (
    <>
      <section className="container-sm my-5">
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
              onChange={handleLicenseNumber}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
              />
              <label className="form-check-label" htmlFor="anxiety-disorders">
                Anxiety Disorders
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="eating-disorders"
                id="eating-disorders"
                onChange={handleDisordersSpecializationCheckboxesChange}
              />
              <label className="form-check-label" htmlFor="eating-disorders">
                Eating Disorders
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="bipolar-affective-disorder"
                id="bipolar-affective-disorder"
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
              />
              <label className="form-check-label" htmlFor="eating-disorders">
                Eating Disorders
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="obsessive-compulsive-disorder"
                id="obsessive-compulsive-disorder"
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                onChange={handleDisordersSpecializationCheckboxesChange}
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
                  onChange={handleFeesCheckboxesChange}
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
                  onChange={handleFeesCheckboxesChange}
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
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-1000-1500">
                  ₱1000-₱1500
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="1500-2000"
                  id="fees-1500-2000"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-1500-2000">
                  ₱1500-₱2000
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="2000-2500"
                  id="fees-2000-2500"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-2000-2500">
                  ₱2000-₱2500
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="2500-3000"
                  id="fees-2500-3000"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-2500-3000">
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
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-3000-3500">
                  ₱3000-₱3500
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="3500-4000"
                  id="fees-3500-4000"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-3500-4000">
                  ₱3500-₱4000
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="4000-4500"
                  id="fees-4000-4500"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-4000-4500">
                  ₱4000-₱4500
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="4500-5000"
                  id="fees-4500-5000"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-4500-5000">
                  ₱4500-₱5000
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="5000-above"
                  id="fees-5000-above"
                  onChange={handleFeesCheckboxesChange}
                />
                <label className="form-check-label" htmlFor="fees-5000-above">
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
                onChange={handleYearsOfExperience}
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
                onChange={handleMinimumAge}
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
                onChange={handleMaximumAge}
                required
              />
            </div>
          </div>

          {/* languages spoken */}
          <div className="mb-3">
            <label className="form-label">
              Languages (separate by a comma and space):
            </label>
            <input
              type="text"
              className="form-control"
              id="languages"
              placeholder="English, Filipino, Bisaya"
              onChange={handleLanguages}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableDaysCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
                  onChange={handleAvailableHoursCheckboxesChange}
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
              onChange={handleContactNumber}
            />
          </div>

          {/* Notes */}
          <div className="form-floating mb-3">
            <textarea
              className="form-control"
              placeholder="Leave additional information here"
              id="floatingTextarea"
              onChange={handleNotes}
            ></textarea>
            <label htmlFor="floatingTextarea">
              Leave additional information here:
            </label>
          </div>

          <Button
            color="primary"
            onClick={handleVerify}
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
      </section>
    </>
  );
};

export default MHPFormPage;
