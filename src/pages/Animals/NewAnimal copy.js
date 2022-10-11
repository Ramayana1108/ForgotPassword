import React, { useState, useEffect } from "react";
import NavWrapper from "../../components/navbar/NavWrapper";
import { db, storage } from "../../services/firebase-config";
import { collection, addDoc,doc,setDoc,updateDoc } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from 'react-router-dom'
import "./newAnimal.scss";

const  NewAnimal = () => {

  const [values, setValues] = useState([]);
  const [quiz1, setQuiz1]= useState([]);
  const [quiz2, setQuiz2]= useState([]);
  const [quiz3, setQuiz3]= useState([]);
  const [file, setFile] = useState("");
  const [sound, setSound] = useState("");
  const [per, setPerc] = useState(null);
  const [per2, setPerc2] = useState(null);
  const [animalInfoError, setAnimalInfoError] = useState("");
  const [imageError, setImageError] = useState("");
  const [quizError,setQuizError]= useState("");
  //Redirecting
  
  const navigate = useNavigate();


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
 
    const name = new Date().getTime() + file.name;
    const name2 = new Date().getTime() + sound.name;

  
    const storageRef = ref(storage, 'images/'+file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const storageRef2 = ref(storage, 'sound/'+sound.name);
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
          const animalRef = doc(db, 'animals', values.animal_name);
         
          setDoc(animalRef, {
            animal_archive:false,
            animal_name:values.animal_name,
            animal_sciname:values.animal_sciname,
            animal_enclosure:String(values.animal_enclosure),
            animal_habitat:values.animal_habitat,
            animal_description:values.animal_description,
            animal_conservationstatus:values.animal_conservationstatus,
            animal_behavior:values.animal_behavior,
            animal_diet:values.animal_diet,
            animal_distribution:values.animal_distribution,
            animal_nutrition:values.animal_nutrition,
            animal_imageurl:downloadURL
            
         })
         .then(() => {
          //quiz1
           const q1Ref = doc(db, "animals", values.animal_name,"animal_quiz","quiz1");
            setDoc(q1Ref,{
              question: String(quiz1.question),
              choicea: String(quiz1.choicea),
              choiceb: String(quiz1.choiceb),
              choicec: String(quiz1.choicec),
              answer: String(quiz1.answer),
              explanation: String(quiz1.explanation)
            }).then(() => {
              //quiz2
              const q2Ref = doc(db, "animals", values.animal_name,"animal_quiz","quiz2");
              setDoc(q2Ref,{
                question: String(quiz2.question),
                choicea: String(quiz2.choicea),
                choiceb: String(quiz2.choiceb),
                choicec: String(quiz2.choicec),
                answer: String(quiz2.answer),
                explanation: String(quiz2.explanation)
              }).then(() => {
                //quiz3
                const q3Ref = doc(db, "animals", values.animal_name,"animal_quiz","quiz3");
                setDoc(q3Ref,{
                  question: String(quiz3.question),
                  choicea: String(quiz3.choicea),
                  choiceb: String(quiz3.choiceb),
                  choicec: String(quiz3.choicec),
                  answer: String(quiz3.answer),
                  explanation: String(quiz3.explanation)
                }).then(() => {

                  uploadTask2.on(
                    "state_changed",
                    (snapshot) => {
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                      getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {        
                                
                        updateDoc(animalRef, {
                          animal_sound:downloadURL
                       })
                       .then(() => {

                        alert('Animal Added' );
                        navigate("/animals")
                       
                       })
                       .catch((error) => {
                         alert(error.message);
                       });
                      });
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
  };
  

  //cancel Button
  function Cancel(){
    navigate("/animals")
  }



  return (
      <div>
        <NavWrapper>
        <h1 class="registerTitle">New Animal</h1> 
        <div className="Auth-form-container-add">
        <form className="Auth-form-add">
          <div className="Auth-form-content-add">
            <div class="center">
            </div>
            <h2>Animal Information</h2>
            <div className="form-group mt-3">
              <label>Common Name</label><br></br>
              <input
                type="text"
                name="animal_name"
                className="form-control mt-1"
                placeholder="Enter Common Name"
                value={values.animal_name} onChange={handleInputChange}/>
              </div>
                
            <div className="form-group mt-3">
              <label>Scientific Name</label>
                <input
                  type="text"
                  name="animal_sciname"
                  className="form-control mt-1"
                  placeholder="Enter Scientific Name"
                  value={values.animal_sciname} onChange={handleInputChange}/>
                  </div>

            <div className="form-group mt-3">
              <label>Enclosure</label>
                <select
                  type="text"
                  name="animal_enclosure"
                  className="form-control mt-1"
                  placeholder="Select Enclosure"
                  onChange={handleInputChange}>
                  <option value="" disabled selected hidden>Select Enclosure</option>
                  <option value={String("Elephant")}>Elephant</option>
                  <option value={String("Hippopotamus")}>Hippopotamus</option>
                  <option value={String("Aviary")}>Aviary</option>
                  <option value={String("Hyena")}>Hyena</option>
                  <option value={String("Savana")}>Savana</option>
                  <option value={String("Apex Predators")}>Apex Predators</option>
                  <option value={String("Philippine Endemic")}>Philippine Endemic</option>
                  <option value={String("Outdoor Reptiles")}>Outdoor Reptiles</option>
                  <option value={String("Indoor Reptiles")}>Indoor Reptiles</option>
                  <option value={String("Primates")}>Primates</option>
                  <option value={String("Butterfly Garden")}>Butterfly Garden</option>
                </select>
                </div>

            <div className="form-group mt-3">
              <label>Animal Habitat</label>
                <input
                  type="text"
                  name="animal_habitat"
                  className="form-control mt-1"
                  placeholder="Enter Animal Habitat"
                  value={values.animal_habitat} onChange={handleInputChange}/>
                  </div>

            <div className="form-group mt-3">
              <label>Description</label>
                <input
                  type="text"
                  name="animal_description"
                  className="form-control mt-1"
                  placeholder="Enter Description"
                  value={values.animal_description} onChange={handleInputChange}/>
                  </div>

              <div className="form-group mt-3">
                <label>Conservation Status</label>
                  <select
                    type="text"
                    name="animal_conservationstatus"
                    className="form-control mt-1"
                    placeholder="Select Conservation Status"
                    onChange={handleInputChange}>
                    <option value="" disabled selected hidden>Select Conservation Status</option>
                    <option value={String("Not Evaluated")}>Not Evaluated</option>
                    <option value={String("Data Deficient")}>Data Deficient</option>
                    <option value={String("Least Concern")}>Least Concern</option>
                    <option value={String("Near Threatened")}>Near Threatened</option>
                    <option value={String("Vulnerable")}>Vulnerable</option>
                    <option value={String("Endangered")}>Endangered</option>
                    <option value={String("Critically Endangered")}>Critically Endangered</option>
                    <option value={String("Extinct in the Wild")}>Extinct in the Wild</option>
                    <option value={String("Extinct")}>Extinct</option>
                    </select>
                      </div>

              <div className="form-group mt-3">
                <label>Behavior</label>
                  <input
                    type="text"
                    name="animal_behavior"
                    className="form-control mt-1"
                    placeholder="Enter Behavior"
                    value={values.animal_behavior} onChange={handleInputChange}/>
                    </div>

              <div className="form-group mt-3">
                <label>Diet</label>
                  <input
                    type="text"
                    name="animal_diet"
                    className="form-control mt-1"
                    placeholder="Enter Diet"
                    value={values.animal_diet} onChange={handleInputChange}/>
                    </div>

              <div className="form-group mt-3">
                <label>Distribution</label>
                <input 
                  type="text"
                  name="animal_distribution"
                  className="form-control mt-1"
                  placeholder="Enter Distribution"
                  value={values.animal_distribution} onChange={handleInputChange}/>
                  </div>

                  <div className="form-group mt-3">
                    <label>Nutrition</label>
                    <input
                      type="text"
                      name="animal_nutrition"
                      className="form-control mt-1"
                      placeholder="Enter Nutrition"
                      value={values.animal_nutrition} onChange={handleInputChange}/>
                      </div>
                      <br></br>
                     
                        <label htmlFor="file">Upload Image: &nbsp;</label>
                        <input
                          type="file"
                          name="animal_image"
                          accept="image/png, image/jpeg, image/jpg"
                          id="file"
                          onChange={(e) => setFile(e.target.files[0])}/>
                       
                        {!per? "":per+"%"}
                        <br></br><br></br>
                       
                            <label htmlFor="sound">
                              Upload sound: &nbsp;
                            </label>
                            <input
                              type="file"
                              name="animal_sound"
                              accept=".mp3"
                              id="sound"
                              onChange={(e) => setSound(e.target.files[0])}/>
                          
                          {!per2? "":per2+"%"}
          <br></br><br></br>
          <h2>Animal Quiz</h2>
          <label>Question 1: </label>
          <input
            type="text"
            name="question"
            className="form-control mt-1"
            placeholder="Enter Question 1"
            value={quiz1.question} onChange={handleInputChangeQuiz1}/>

            <br></br>

          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className="form-control mt-1"
            placeholder="Enter First Choice"
            value={quiz1.choicea} onChange={handleInputChangeQuiz1}/>
            
          <input
            type="text"
            name="choiceb"
            className="form-control mt-1"
            placeholder="Enter Second Choice"
            value={quiz1.choiceb} onChange={handleInputChangeQuiz1}/>

          <input
            type="text"
            name="choicec"
            className="form-control mt-1"
            placeholder="Enter Third Choice"
            value={quiz1.choicec} onChange={handleInputChangeQuiz1}/>

          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer"
            className="form-control mt-1"
            placeholder="Enter Answer"
            value={quiz1.answer} onChange={handleInputChangeQuiz1}/>
          
          <br></br>
          <label>Explanation</label>
          <input
            type="text"
            name="explanation"
            className="form-control mt-1"
            placeholder="Enter Explanation"
            value={quiz1.explanation} onChange={handleInputChangeQuiz1}/>

          <br></br>
          <label>Question 2: </label>
          <input
            type="text"
            name="question"
            className="form-control mt-1"
            placeholder="Enter Question 2"
            value={quiz2.question} onChange={handleInputChangeQuiz2}/>

          <br></br>
          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className="form-control mt-1"
            placeholder="Enter First Choice"
            value={quiz2.choicea} onChange={handleInputChangeQuiz2}/>
            
          <input
            type="text"
            name="choiceb"
            className="form-control mt-1"
            placeholder="Enter Second Choice"
            value={quiz2.choiceb} onChange={handleInputChangeQuiz2}/>

          <input
            type="text"
            name="choicec"
            className="form-control mt-1"
            placeholder="Enter Third Choice"
            value={quiz2.choicec} onChange={handleInputChangeQuiz2}/>

          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer" 
            className="form-control mt-1"
            placeholder="Enter Answer"
            value={quiz2.answer} onChange={handleInputChangeQuiz2}/>

          <br></br>
          <label>Explanation</label>
          <input
            type="text"
            name="explanation"
            className="form-control mt-1"
            placeholder="Enter Explanation"
            value={quiz2.explanation} onChange={handleInputChangeQuiz2}/>
          
          <br></br>
          <label>Question 3: </label>
          <input
            type="text"
            name="question" 
            className="form-control mt-1"
            placeholder="Enter Question 3"
            value={quiz3.question} onChange={handleInputChangeQuiz3}/>

          <br></br>
          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className="form-control mt-1"
            placeholder="Enter First Choice"
            value={quiz3.choicea} onChange={handleInputChangeQuiz3}/>

          <input
            type="text" 
            name="choiceb"
            className="form-control mt-1"
            placeholder="Enter Second Choice"
            value={quiz3.choiceb} onChange={handleInputChangeQuiz3}/>

          <input
            type="text"
            name="choicec"
            className="form-control mt-1"
            placeholder="Enter Third Choice"
            value={quiz3.choicec} onChange={handleInputChangeQuiz3}/>

          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer"
            className="form-control mt-1"
            placeholder="Enter Answer" 
            alue={quiz3.answer} onChange={handleInputChangeQuiz3}/>

          <br></br>
          <label>Explanation</label>
          <input 
            type="text"
            name="explanation"
            className="form-control mt-1"
            placeholder="Enter Explanation"
            value={quiz3.explanation} onChange={handleInputChangeQuiz3}/>
          
          <br></br>
          <br></br>
          <div className="newanimal-btn-add">
          <button onClick={AddAnimal} type="submit" className="btn btn-primary-add">
            Save
            </button>
           
          <button onClick={(e) => {e.preventDefault();if(window.confirm("Are you sure you want to cancel?")){Cancel()}}} className="btn btn-primary-cancel">
            Cancel
            </button>
          
          </div>
          </div>
          </form>
          </div>
        </NavWrapper>  
    </div>
  );
};

export default NewAnimal;