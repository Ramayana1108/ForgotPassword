import React, { useState, useEffect } from "react";
import NavWrapper from "../../components/navbar/NavWrapper";
import { db, storage } from "../../services/firebase-config";
import { collection, addDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import "./newAnimal.scss";

const NewAnimal = () => {
  const [values, setValues] = useState([]);
  const [quiz1, setQuiz1] = useState([]);
  const [quiz2, setQuiz2] = useState([]);
  const [quiz3, setQuiz3] = useState([]);
  const [file, setFile] = useState("");
  const [sound, setSound] = useState("");
  const [per, setPerc] = useState(null);
  const [per2, setPerc2] = useState(null);
  const [animalInfoError, setAnimalInfoError] = useState("");
  const [imageError, setImageError] = useState("");
  const [quizError, setQuizError] = useState("");
  //Redirecting

  const navigate = useNavigate();

  const checkAnimalInfo = () => {
    if (
      !values.animal_name ||
      !values.animal_sciname ||
      !values.animal_enclosure ||
      !values.animal_habitat ||
      !values.animal_description ||
      !values.animal_conservationstatus ||
      !values.animal_behavior ||
      !values.animal_diet ||
      !values.animal_distribution ||
      !values.animal_nutrition
    ) {
      return true;
    } else {
      return false;
    }
  };

  const checkAnimalQuiz = () => {
    if (
      !quiz1.question ||
      !quiz1.choicea ||
      !quiz1.choiceb ||
      !quiz1.choicec ||
      !quiz1.answer ||
      !quiz1.explanation ||
      !quiz2.question ||
      !quiz2.choicea ||
      !quiz2.choiceb ||
      !quiz2.choicec ||
      !quiz2.answer ||
      !quiz2.explanation ||
      !quiz3.question ||
      !quiz3.choicea ||
      !quiz3.choiceb ||
      !quiz3.choicec ||
      !quiz3.answer ||
      !quiz3.explanation
    ) {
      return true;
    } else {
      return false;
    }
  };

  //handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleInputChangeQuiz1 = (e) => {
    const { name, value } = e.target;
    setQuiz1({
      ...quiz1,
      [name]: value,
    });
  };
  const handleInputChangeQuiz2 = (e) => {
    const { name, value } = e.target;
    setQuiz2({
      ...quiz2,
      [name]: value,
    });
  };
  const handleInputChangeQuiz3 = (e) => {
    const { name, value } = e.target;
    setQuiz3({
      ...quiz3,
      [name]: value,
    });
  };

  //Add Animal with image
  const AddAnimal = (event) => {
    event.preventDefault();

    console.log(checkAnimalInfo());
    const name = new Date().getTime() + file.name;
    const name2 = new Date().getTime() + sound.name;

    if (
      checkAnimalInfo() === true &&
      !file === true &&
      checkAnimalQuiz() === true
    ) {
      setAnimalInfoError("*All animal information fields are required");
      setImageError("* An image must be uploaded");
      setQuizError("*All Animal Quiz Fields are required");
    } else if (
      checkAnimalInfo() === false &&
      !file === true &&
      checkAnimalQuiz() === true
    ) {
      setAnimalInfoError("");
      setImageError("* An image must be uploaded");
      setQuizError("*All Animal Quiz Fields are required");
    } else if (
      checkAnimalInfo() === false &&
      !file === false &&
      checkAnimalQuiz() === true
    ) {
      setAnimalInfoError("");
      setImageError("");
      setQuizError("*All Animal Quiz Fields are required");
    } else if (
      checkAnimalInfo() === false &&
      !file === true &&
      checkAnimalQuiz() === false
    ) {
      setAnimalInfoError("");
      setImageError("* An image must be uploaded");
      setQuizError("");
    } else if (
      checkAnimalInfo() === true &&
      !file === false &&
      checkAnimalQuiz() === false
    ) {
      setAnimalInfoError("*All animal information fields are required");
      setImageError("");
      setQuizError("");
    } else {
      setAnimalInfoError("");
      setImageError("");
      setQuizError("");

      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      const storageRef2 = ref(storage, "sound/" + sound.name);
      const uploadTask2 = uploadBytesResumable(storageRef2, sound);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const animalRef = doc(db, "animals", values.animal_name);

            setDoc(animalRef, {
              animal_archive: false,
              animal_name: values.animal_name,
              animal_sciname: values.animal_sciname,
              animal_enclosure: String(values.animal_enclosure),
              animal_habitat: values.animal_habitat,
              animal_description: values.animal_description,
              animal_conservationstatus: values.animal_conservationstatus,
              animal_behavior: values.animal_behavior,
              animal_diet: values.animal_diet,
              animal_distribution: values.animal_distribution,
              animal_nutrition: values.animal_nutrition,
              animal_imageurl: downloadURL,
            })
              .then(() => {
                //quiz1
                const q1Ref = doc(
                  db,
                  "animals",
                  values.animal_name,
                  "animal_quiz",
                  "quiz1"
                );
                setDoc(q1Ref, {
                  question: String(quiz1.question),
                  choicea: String(quiz1.choicea),
                  choiceb: String(quiz1.choiceb),
                  choicec: String(quiz1.choicec),
                  answer: String(quiz1.answer),
                  explanation: String(quiz1.explanation),
                })
                  .then(() => {
                    //quiz2
                    const q2Ref = doc(
                      db,
                      "animals",
                      values.animal_name,
                      "animal_quiz",
                      "quiz2"
                    );
                    setDoc(q2Ref, {
                      question: String(quiz2.question),
                      choicea: String(quiz2.choicea),
                      choiceb: String(quiz2.choiceb),
                      choicec: String(quiz2.choicec),
                      answer: String(quiz2.answer),
                      explanation: String(quiz2.explanation),
                    })
                      .then(() => {
                        //quiz3
                        const q3Ref = doc(
                          db,
                          "animals",
                          values.animal_name,
                          "animal_quiz",
                          "quiz3"
                        );
                        setDoc(q3Ref, {
                          question: String(quiz3.question),
                          choicea: String(quiz3.choicea),
                          choiceb: String(quiz3.choiceb),
                          choicec: String(quiz3.choicec),
                          answer: String(quiz3.answer),
                          explanation: String(quiz3.explanation),
                        })
                          .then(() => {
                            uploadTask2.on(
                              "state_changed",
                              (snapshot) => {
                                const progress =
                                  (snapshot.bytesTransferred /
                                    snapshot.totalBytes) *
                                  100;
                                console.log("Upload is " + progress + "% done");
                                setPerc2(progress);
                                switch (snapshot.state) {
                                  case "paused":
                                    console.log("Upload is paused");
                                    break;
                                  case "running":
                                    console.log("Upload is running");
                                    break;
                                  default:
                                    break;
                                }
                              },
                              (error) => {
                                console.log(error);
                              },
                              () => {
                                getDownloadURL(uploadTask2.snapshot.ref).then(
                                  (downloadURL) => {
                                    updateDoc(animalRef, {
                                      animal_sound: downloadURL,
                                    })
                                      .then(() => {
                                        alert("Animal Added");
                                        navigate("/animals");
                                      })
                                      .catch((error) => {
                                        alert(error.message);
                                      });
                                  }
                                );
                              }
                            );
                          })
                          .catch((error) => {
                            alert(error.message);
                          });

                        //end of 3rd quiz
                      })
                      .catch((error) => {
                        alert(error.message);
                      });

                    //end of 2nd quiz
                  })
                  .catch((error) => {
                    alert(error.message);
                  });

                //end of first quiz
              })
              .catch((error) => {
                alert(error.message);
              });
          });
        }
      );
    }
  };

  //cancel Button
  function Cancel() {
    navigate("/animals");
  }

  return (
    <div>
      <NavWrapper>
        <h1 class="registerTitle">New Animal</h1>
        <div className="Auth-form-container-add">
          <form className="Auth-form-animal">
            <div className="Auth-form-content-animal">
              <h2>Animal Information</h2>
              <div className="error-text">{animalInfoError}</div>
              <br/>
              {/* GROUP 1 */}
              <div className="animal-form-group">
                <div className="form-group mt-1">
                  <label>Common Name</label>
                  <input
                    type="text"
                    name="animal_name"
                    className={`form-control mt-1 ${
                      !values.animal_name && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Common Name"
                    value={values.animal_name}
                    onChange={handleInputChange}
                  />
                </div>
                <br/>

                <div className="form-group mt-1">
                  <label>Scientific Name</label>
                  <input
                    type="text"
                    name="animal_sciname"
                    className={`form-control mt-1 ${
                      !values.animal_sciname && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Scientific Name"
                    value={values.animal_sciname}
                    onChange={handleInputChange}
                  />
                </div>
                <br/>

                <div className="form-group mt-1">
                  <label>Enclosure</label>
                  <select
                    type="text"
                    name="animal_enclosure"
                    className={`form-control mt-1 ${
                      !values.animal_enclosure && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Select Enclosure"
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected hidden>
                      Select Enclosure
                    </option>
                    <option value={String("Elephant")}>Elephant</option>
                    <option value={String("Hippopotamus")}>Hippopotamus</option>
                    <option value={String("Aviary")}>Aviary</option>
                    <option value={String("Hyena")}>Hyena</option>
                    <option value={String("Savana")}>Savana</option>
                    <option value={String("Apex Predators")}>
                      Apex Predators
                    </option>
                    <option value={String("Philippine Endemic")}>
                      Philippine Endemic
                    </option>
                    <option value={String("Outdoor Reptiles")}>
                      Outdoor Reptiles
                    </option>
                    <option value={String("Indoor Reptiles")}>
                      Indoor Reptiles
                    </option>
                    <option value={String("Primates")}>Primates</option>
                    <option value={String("Butterfly Garden")}>
                      Butterfly Garden
                    </option>
                  </select>
                </div>
<br/>

                <div className="form-group mt-1">
                  <label>Conservation Status</label>
                  <select
                    type="text"
                    name="animal_conservationstatus"
                    className={`form-control mt-1 ${
                      !values.animal_conservationstatus &&
                      animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Select Conservation Status"
                    onChange={handleInputChange}
                  >
                    <option value="" disabled selected hidden>
                      Select Conservation Status
                    </option>
                    <option value={String("Not Evaluated")}>
                      Not Evaluated
                    </option>
                    <option value={String("Data Deficient")}>
                      Data Deficient
                    </option>
                    <option value={String("Least Concern")}>
                      Least Concern
                    </option>
                    <option value={String("Near Threatened")}>
                      Near Threatened
                    </option>
                    <option value={String("Vulnerable")}>Vulnerable</option>
                    <option value={String("Endangered")}>Endangered</option>
                    <option value={String("Critically Endangered")}>
                      Critically Endangered
                    </option>
                    <option value={String("Extinct in the Wild")}>
                      Extinct in the Wild
                    </option>
                    <option value={String("Extinct")}>Extinct</option>
                  </select>
                </div>
                <br/>

                <div className="form-group mt-1">
                  <div className="error-text"> {imageError}</div>
                  <label htmlFor="file">Upload Image: &nbsp;</label>
                  <input
                    type="file"
                    name="animal_image"
                    className={`form-control mt-1 ${
                      imageError ? "is-invalid" : ""
                    }`}
                    accept="image/png, image/jpeg, image/jpg"
                    id="file"
                    onChange={(e) => setFile(e.target.files[0])}
                  />

                  {!per ? "" : per + "%"}
                </div>
<br/>

                <div className="form-group mt-1">
                  <label htmlFor="sound">Upload sound: &nbsp;</label>
                  <input
                    type="file"
                    name="animal_sound"
                    className={`form-control mt-1 ${
                      imageError ? "is-invalid" : ""
                    }`}
                    accept=".mp3"
                    id="sound"
                    onChange={(e) => setSound(e.target.files[0])}
                  />

                  {!per2 ? "" : per2 + "%"}
                </div>
              </div>
              </div>
              {/* END GROUP 1 */}

              {/* GROUP 2 */}
              <br/>
              <div className="animal-form-group2">
              <div className="form-group mt-1">
                  <label>Animal Habitat</label>
                  <textarea
                    type="text"
                    name="animal_habitat"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_habitat
                        ? "is-invalid" && animalInfoError !== ""
                        : ""
                    }`}
                    placeholder="Enter Animal Habitat"
                    value={values.animal_habitat}
                    onChange={handleInputChange}
                  />
                </div>
                <br/>

                <div className="form-group mt-1">
                  <label>Behavior</label>
                  <textarea
                    type="text"
                    name="animal_behavior"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_behavior && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Behavior"
                    value={values.animal_behavior}
                    onChange={handleInputChange}
                  />
                </div>

                <br/>
                <div className="form-group mt-1">
                  <label>Nutrition</label>
                  <textarea
                    type="text"
                    name="animal_nutrition"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_nutrition && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Nutrition"
                    value={values.animal_nutrition}
                    onChange={handleInputChange}
                  />
                </div>
                <br/>

                <div className="form-group mt-1">
                  <label>Diet</label>
                  <textarea
                    type="text"
                    name="animal_diet"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_diet && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Diet"
                    value={values.animal_diet}
                    onChange={handleInputChange}
                  />
                </div>
<br/>

                <div className="form-group mt-1">
                  <label>Description</label>
                  <textarea
                    type="text"
                    name="animal_description"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_description && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Description"
                    value={values.animal_description}
                    onChange={handleInputChange}
                  />
                </div>
                <br/>

                <div className="form-group mt-1">
                  <label>Distribution</label>
                  <textarea
                    type="text"
                    name="animal_distribution"
                    className={`form-control mt-1 textareas-description ${
                      !values.animal_distribution && animalInfoError !== ""
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter Distribution"
                    value={values.animal_distribution}
                    onChange={handleInputChange}
                  />
                </div>
                </div>
            {/* END GROUP 2 */}
            <br></br>
            
            <div className="Auth-form-content-quiz">
              <h2>Animal Quiz</h2>
              <div className="error-text"> {quizError}</div>
              <br/>
              <label>Question 1 </label>
              <textarea
                type="text"
                name="question"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.question && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Question 1"
                value={quiz1.question}
                onChange={handleInputChangeQuiz1}
              />

              <br/>

              <label>Choices</label>
              <textarea
                type="text"
                name="choicea"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.choicea && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter First Choice"
                value={quiz1.choicea}
                onChange={handleInputChangeQuiz1}
              />

              <textarea
                type="text"
                name="choiceb"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.choiceb && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Second Choice"
                value={quiz1.choiceb}
                onChange={handleInputChangeQuiz1}
              />

              <textarea
                type="text"
                name="choicec"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.choicec && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Third Choice"
                value={quiz1.choicec}
                onChange={handleInputChangeQuiz1}
              />

<br/>
              <label>Answer</label>
              <textarea
                type="text"
                name="answer"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.answer && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Answer"
                value={quiz1.answer}
                onChange={handleInputChangeQuiz1}
              />

<br/>
              <label>Explanation</label>
              <textarea
                type="text"
                name="explanation"
                className={`form-control mt-1 textareas-description ${
                  !quiz1.explanation && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Explanation"
                value={quiz1.explanation}
                onChange={handleInputChangeQuiz1}
              />

<br/>
              <label>Question 2 </label>
              <textarea
                type="text"
                name="question"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.question && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Question 2"
                value={quiz2.question}
                onChange={handleInputChangeQuiz2}
              />

<br/>
              <label>Choices</label>
              <textarea
                type="text"
                name="choicea"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.choicea && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter First Choice"
                value={quiz2.choicea}
                onChange={handleInputChangeQuiz2}
              />

              <textarea
                type="text"
                name="choiceb"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.choiceb && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Second Choice"
                value={quiz2.choiceb}
                onChange={handleInputChangeQuiz2}
              />

              <textarea
                type="text"
                name="choicec"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.choicec && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Third Choice"
                value={quiz2.choicec}
                onChange={handleInputChangeQuiz2}
              />

<br/>
              <label>Answer</label>
              <textarea
                type="text"
                name="answer"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.answer && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Answer"
                value={quiz2.answer}
                onChange={handleInputChangeQuiz2}
              />

<br/>
              <label>Explanation</label>
              <textarea
                type="text"
                name="explanation"
                className={`form-control mt-1 textareas-description ${
                  !quiz2.explanation && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Explanation"
                value={quiz2.explanation}
                onChange={handleInputChangeQuiz2}
              />

<br/>
              <label>Question 3 </label>
              <textarea
                type="text"
                name="question"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.question && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Question 3"
                value={quiz3.question}
                onChange={handleInputChangeQuiz3}
              />

<br/>
              <label>Choices</label>
              <textarea
                type="text"
                name="choicea"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.choicea && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter First Choice"
                value={quiz3.choicea}
                onChange={handleInputChangeQuiz3}
              />

              <textarea
                type="text"
                name="choiceb"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.choiceb && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Second Choice"
                value={quiz3.choiceb}
                onChange={handleInputChangeQuiz3}
              />

              <textarea
                type="text"
                name="choicec"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.choicec && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Third Choice"
                value={quiz3.choicec}
                onChange={handleInputChangeQuiz3}
              />

<br/>
              <label>Answer</label>
              <textarea
                type="text"
                name="answer"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.answer && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Answer"
                value={quiz3.answer}
                onChange={handleInputChangeQuiz3}
              />

<br/>
              <label>Explanation</label>
              <textarea
                type="text"
                name="explanation"
                className={`form-control mt-1 textareas-description ${
                  !quiz3.explanation && quizError !== "" ? "is-invalid" : ""
                }`}
                placeholder="Enter Explanation"
                value={quiz3.explanation}
                onChange={handleInputChangeQuiz3}
              />
            </div>
            <br/><br/>
            <div className="newanimal-btn-add">
              <button
                onClick={AddAnimal}
                type="submit"
                className="btn btn-primary-add"
              >
                Save
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm("Are you sure you want to cancel?")) {
                    Cancel();
                  }
                }}
                className="btn btn-primary-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </NavWrapper>
    </div>
  );
};

export default NewAnimal;
