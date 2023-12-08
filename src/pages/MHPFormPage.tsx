import { useRef, useState, useEffect } from "react";
import Button from "../components/Button";

const MHPFormPage = () => {
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
  return (
    <>
      <section className="container-sm mt-5">
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
              onChange={(e) => {
                e.target.value === ""
                  ? setValidLicenseNumber(false)
                  : setValidLicenseNumber(true);
              }}
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
            onClick={() => {
              console.log("submitted!!!");
            }}
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
