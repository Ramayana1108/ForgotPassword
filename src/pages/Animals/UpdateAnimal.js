import { db, storage  } from "../../services/firebase-config";
import React,{useState, useEffect} from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { collection, query, where,getDocs, doc, getDoc,updateDoc, QuerySnapshot,onSnapshot, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL,getStorage,deleteObject  } from "firebase/storage";
import 'firebase/firestore';
import "./UpdateAnimal.scss";
import NavWrapper from "../../components/navbar/NavWrapper";
import e from "cors";


const  UpdateAnimal = () => {
 
  const [values, setValues] = useState([]);
  const [quiz1, setQuiz1]= useState([]);
  const [quiz2, setQuiz2]= useState([]);
  const [quiz3, setQuiz3]= useState([]);
  const [animalInfoError, setAnimalInfoError] = useState("");
  const [quizError,setQuizError]= useState("");

  const [data, setData] = useState({});


  const [file, setFile] = useState("");
  const [sound, setSound] = useState("");
  const [per, setPerc] = useState(null);
  const [per2, setPerc2] = useState(null);

  //getting animal
  const getaid = useLocation();
  const aid = getaid.state.aid;

  const docRef = doc(db,'animals',aid);
  const subdocRef = collection(db,'animals',aid,"animal_quiz");

  
  const checkAnimalInfo = () =>{
    if( !values.animal_name  || !values.animal_sciname ||! values.animal_enclosure ||
      !values.animal_habitat || !values.animal_description || !values.animal_conservationstatus ||
       !values.animal_behavior || !values.animal_diet ||!values.animal_distribution ||
       !values.animal_nutrition){
        return true
       }else{
        return false
       }
  }

  const checkAnimalQuiz = () => {

    if(!quiz1.question  || !quiz1.choicea  || !quiz1.choiceb ||
      !quiz1.choicec   || !quiz1.answer  || !quiz1.explanation||  !quiz2.question|| !quiz2.choicea||
      !quiz2.choiceb ||!quiz2.choicec || !quiz2.answer  || !quiz2.explanation  ||
      !quiz3.question || !quiz3.choicea ||
      !quiz3.choiceb  || !quiz3.choicec  || !quiz3.answer || !quiz3.explanation){
        return true
      }else{
       return false
      }
  }


  //getting values
  useEffect(() => {
    getDoc(docRef).then(doc => {
        const newData = doc.data();
        setData(newData);
        setValues(newData);            
    })
    }, []);

    //getting quiz
    useEffect(() => {
      const unsub = onSnapshot(       
        subdocRef,
        (snapShot) => {

          snapShot.docs.forEach((doc) => {
                if(doc.id === "quiz1"){
                  setQuiz1({ id: doc.id, ...doc.data() });
                }if(doc.id === "quiz2"){
                  setQuiz2({ id: doc.id, ...doc.data() });
                }else{
                  setQuiz3({ id: doc.id, ...doc.data() });
                }
                            
              });           
        },
        (error) => {
          console.log(error);
        }
      );
      return () => {
        unsub();
      };
    }, []);

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

  //Updating animal
  const UpdateAnimal = (e) => {
    e.preventDefault();

    if( checkAnimalInfo() === true && checkAnimalQuiz() === true){
      setAnimalInfoError("*All animal information fields are required");
      setQuizError("*All Animal Quiz Fields are required");
    }else if( checkAnimalInfo() === false  && checkAnimalQuiz() === true ){
      setAnimalInfoError("");
      setQuizError("*All Animal Quiz Fields are required");
    }else if( checkAnimalInfo() === false  && checkAnimalQuiz() === true ){
      setAnimalInfoError("");
      setQuizError("*All Animal Quiz Fields are required");
    }else{
      setAnimalInfoError("");
      setQuizError("");

      if(window.confirm("Do you want to save changes?")){
        const imagename = (file.name === undefined || file.name == null || file.name <= 0) ? true : false;
        const soundname = (sound.name === undefined || sound.name == null || sound.name <= 0) ? true : false;
    
    
        const storageRef = ref(storage, 'images/'+file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
    
        const storageRef2 = ref(storage, 'sound/'+sound.name);
        const uploadTask2 = uploadBytesResumable(storageRef2, sound);
        
        // Create a reference to the file to delete
        const desertsoundRef = ref(storage, data.animal_sound);
        const desertimageRef = ref(storage, data.animal_imageurl);
    
        if(imagename === false){
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
                   console.log(data.animal_imageurl)
                  // Delete the file
                   deleteObject(desertimageRef).then(() => {   
                    updateDoc(docRef, {
                      animal_imageurl:downloadURL
                   });                                
                   }).catch((error) => {
                 // Uh-oh, an error occurred!
                 });
                });
          });
        }else{
          uploadTask.cancel()
        }
    
        if(soundname === false ){
          uploadTask2.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              setPerc2(progress);
            },
            (error) => {
              console.log(error);
            },
            () => {
              getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {
                   console.log(data.animal_sound)
                  // Delete the file
                   deleteObject(desertsoundRef).then(() => {   
                    updateDoc(docRef, {
                      animal_sound:downloadURL
                   });                                
                   }).catch((error) => {
                 // Uh-oh, an error occurred!
                 });
                });
          });
    
        }else{
          uploadTask2.cancel()
        }
    
        console.log(soundname)
        console.log(imagename)
        updateDoc(docRef, {
          animal_name:values.animal_name,
          animal_sciname:values.animal_sciname,
          animal_enclosure:values.animal_enclosure,
          animal_habitat:values.animal_habitat,
          animal_description:values.animal_description,
          animal_conservationstatus:values.animal_conservationstatus,
          animal_behavior:values.animal_behavior,
          animal_diet:values.animal_diet,
          animal_distribution:values.animal_distribution,
          animal_nutrition:values.animal_nutrition,
          })
          .then(() => {
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
                     
                      alert('Animal Updated' );
                      navigate("/animals")
          
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
          // alert('Updated' );
          // navigate("/animals")
          })
          .catch((error) => {
          alert(error.message);
          });
            
    
    
        }
       
        
      }

   
   
   
  };
  

  //cancel Button
  function Cancel(){
    navigate("/animals")
  }



return (
      <div>
        <NavWrapper>
        <h1 class="registerTitle">Edit Animal</h1> 
        <div className="Auth-form-container-add">
        <form className="Auth-form-animal">
          <div className="Auth-form-content-add">
            <div class="center">
            </div>
            <h2>Animal Information</h2>
            <div className="error-text">{animalInfoError}</div>
            <div className="form-group mt-3">
              <label>Common Name</label><br></br>
              <input
                type="text"
                name="animal_name"
                className={`form-control mt-1 ${!values.animal_name ? 'is-invalid':  ''}`}
                placeholder="Enter Common Name"
                value={values.animal_name} onChange={handleInputChange}/>
              </div>
                
            <div className="form-group mt-3">
              <label>Scientific Name</label>
                <input
                  type="text"
                  name="animal_sciname"
                  className={`form-control mt-1 ${!values.animal_sciname ? 'is-invalid':  ''}`}
                  placeholder="Enter Scientific Name"
                  value={values.animal_sciname} onChange={handleInputChange}/>
                  </div>

            <div className="form-group mt-3">
              <label>Enclosure</label>
                <select
                  type="text"
                  name="animal_enclosure"
                  className={`form-control mt-1 ${!values.animal_enclosure ? 'is-invalid':  ''}`}
                  placeholder="Select Enclosure"
                  onChange={handleInputChange}>
                  <option value="" disabled selected hidden>{values.animal_enclosure}</option>
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
                  className={`form-control mt-1 ${!values.animal_habitat ? 'is-invalid':  ''}`}
                  placeholder="Enter Animal Habitat"
                  value={values.animal_habitat} onChange={handleInputChange}/>
                  </div>

            <div className="form-group mt-3">
              <label>Description</label>
                <input
                  type="text"
                  name="animal_description"
                  className={`form-control mt-1 ${!values.animal_description ? 'is-invalid':  ''}`}
                  placeholder="Enter Description"
                  value={values.animal_description} onChange={handleInputChange}/>
                  </div>

              <div className="form-group mt-3">
                <label>Conservation Status</label>
                  <select
                    type="text"
                    name="animal_conservationstatus"
                    className={`form-control mt-1 ${!values.animal_conservationstatus ? 'is-invalid':  ''}`}
                    placeholder="Select Conservation Status"
                    onChange={handleInputChange}>
                    <option value="" disabled selected hidden>{values.animal_conservationstatus}</option>
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
                    className={`form-control mt-1 ${!values.animal_behavior && animalInfoError !=="" ? 'is-invalid':  ''}`}
                    placeholder="Enter Behavior"
                    value={values.animal_behavior} onChange={handleInputChange}/>
                    </div>

              <div className="form-group mt-3">
                <label>Diet</label>
                  <input
                    type="text"
                    name="animal_diet"
                    className={`form-control mt-1 ${!values.animal_diet && animalInfoError !=="" ? 'is-invalid':  ''}`}
                    placeholder="Enter Diet"
                    value={values.animal_diet} onChange={handleInputChange}/>
                    </div>

              <div className="form-group mt-3">
                <label>Distribution</label>
                <input 
                  type="text"
                  name="animal_distribution"
                  className={`form-control mt-1 ${!values.animal_distribution && animalInfoError !==""? 'is-invalid':  ''}`}
                  placeholder="Enter Distribution"
                  value={values.animal_distribution} onChange={handleInputChange}/>
                  </div>
                  <br></br>
                  <br></br>
                  <br></br>
                  <div className="form-group mt-3">
                    <label>Nutrition</label>
                    <input
                      type="text"
                      name="animal_nutrition"
                      className={`form-control mt-1 ${!values.animal_nutrition && animalInfoError !==""? 'is-invalid':  ''}`}
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
                        <br></br>
                        <br></br>
                       
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
          <div className="error-text"> {quizError}</div>
          <br></br>
          <label>Question 1: </label>
          <input
            type="text"
            name="question"
            className={`form-control mt-1 ${!quiz1.question && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Question 1"
            value={quiz1.question} onChange={handleInputChangeQuiz1}/>

            <br></br>
            
          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className={`form-control mt-1 ${!quiz1.choicea && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter First Choice"
            value={quiz1.choicea} onChange={handleInputChangeQuiz1}/>
            
          <input
            type="text"
            name="choiceb"
            className={`form-control mt-1 ${!quiz1.choiceb && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Second Choice"
            value={quiz1.choiceb} onChange={handleInputChangeQuiz1}/>

          <input
            type="text"
            name="choicec"
            className={`form-control mt-1 ${!quiz1.choicec && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Third Choice"
            value={quiz1.choicec} onChange={handleInputChangeQuiz1}/>


          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer"
            className={`form-control mt-1 ${!quiz1.answer && quizError !=="" ? 'is-invalid':  ''}`}
            placeholder="Enter Answer"
            value={quiz1.answer} onChange={handleInputChangeQuiz1}/>
          
          <br></br>
          <label>Explanation</label>
          <input
            type="text"
            name="explanation"
            className={`form-control mt-1 ${!quiz1.explanation && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Explanation"
            value={quiz1.explanation} onChange={handleInputChangeQuiz1}/>

          <br></br>
          <label>Question 2: </label>
          <input
            type="text"
            name="question"
            className={`form-control mt-1 ${!quiz2.question && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Question 2"
            value={quiz2.question} onChange={handleInputChangeQuiz2}/>

          <br></br>
          <br></br>
          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className={`form-control mt-1 ${!quiz2.choicea && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter First Choice"
            value={quiz2.choicea} onChange={handleInputChangeQuiz2}/>
            
          <input
            type="text"
            name="choiceb"
            className={`form-control mt-1 ${!quiz2.choiceb && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Second Choice"
            value={quiz2.choiceb} onChange={handleInputChangeQuiz2}/>

          <input
            type="text"
            name="choicec"
            className={`form-control mt-1 ${!quiz2.choicec && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Third Choice"
            value={quiz2.choicec} onChange={handleInputChangeQuiz2}/>

   

          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer" 
            className={`form-control mt-1 ${!quiz2.answer && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Answer"
            value={quiz2.answer} onChange={handleInputChangeQuiz2}/>

          <br></br>
          <label>Explanation</label>
          <input
            type="text"
            name="explanation"
            className={`form-control mt-1 ${!quiz2.explanation && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Explanation"
            value={quiz2.explanation} onChange={handleInputChangeQuiz2}/>
          
          <br></br>
          <label>Question 3: </label>
          <input
            type="text"
            name="question" 
            className={`form-control mt-1 ${!quiz3.question && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Question 3"
            value={quiz3.question} onChange={handleInputChangeQuiz3}/>

          <br></br>
          <label>Choices</label>
          <input
            type="text"
            name="choicea"
            className={`form-control mt-1 ${!quiz3.choicea && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter First Choice"
            value={quiz3.choicea} onChange={handleInputChangeQuiz3}/>

          <input
            type="text" 
            name="choiceb"
            className={`form-control mt-1 ${!quiz3.choiceb && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Second Choice"
            value={quiz3.choiceb} onChange={handleInputChangeQuiz3}/>

          <input
            type="text"
            name="choicec"
            className={`form-control mt-1 ${!quiz3.choicec && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Third Choice"
            value={quiz3.choicec} onChange={handleInputChangeQuiz3}/>


          <br></br>
          <label>Answer</label>
          <input
            type="text"
            name="answer"
            className={`form-control mt-1 ${!quiz3.answer && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Answer" 
            value={quiz3.answer} onChange={handleInputChangeQuiz3}/>

          <br></br>
          <label>Explanation</label>
          <input 
            type="text"
            name="explanation"
            className={`form-control mt-1 ${!quiz3.explanation && quizError !==""? 'is-invalid':  ''}`}
            placeholder="Enter Explanation"
            value={quiz3.explanation} onChange={handleInputChangeQuiz3}/>
          
          <br></br>
          <br></br>
          <div className="editanimal-btn-add">
          <button onClick={UpdateAnimal} type="submit" className="btn btn-primary-add">
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


export default UpdateAnimal;