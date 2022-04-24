// import { get, set } from "core-js/core/dict";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,addDoc, Firestore, doc, setDoc, getDoc, arrayRemove, updateDoc, arrayUnion, deleteDoc, DocumentReference, collectionGroup, query,where,onSnapshot, limitToLast, increment,limit,startAfter,orderBy, deleteField,enableIndexedDbPersistence} from "firebase/firestore"
// import { setThePassword, setTheUsername } from "whatwg-url";
import { getAuth,createUserWithEmailAndPassword , onAuthStateChanged, signOut, reauthenticateWithRedirect, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, signInWithPopup,setPersistence,inMemoryPersistence, browserLocalPersistence, sendEmailVerification,sendPasswordResetEmail} from "firebase/auth"
import {getDatabase,ref,set,child,update,remove, get, onValue} from 'firebase/database'

import { prompts } from "./prompt.js"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg4sP_I9YuGicLXVp0yYWg0GFrjjQQOxE",
  authDomain: "journal-7b188.firebaseapp.com",
  databaseURL: "https://journal-7b188-default-rtdb.firebaseio.com",
  projectId: "journal-7b188",
  storageBucket: "journal-7b188.appspot.com",
  messagingSenderId: "1046518623339",
  appId: "1:1046518623339:web:d9b6821d40e2964154152e"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// init services
const db = getFirestore()
const auth = getAuth();
const provider = new GoogleAuthProvider();
// Usre firestore offline
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
        //   TESTING PERSISTENCE
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });


// JournalApp
const journalApp = {
    init:() =>{
        if(localStorage.getItem("darkMode?") === "true"){
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        document.addEventListener("DOMContentLoaded",journalApp.load);
    },
    load: ()=>{
        journalApp.pageScript();
    },
    pageScript: ()=>{
        //journal app will direct to object dedicated to javascript for a certain html
        let page = document.body.id;
        if(localStorage.getItem("darkMode?") === "true"){
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        switch(page){
            case 'signUpPage':
                journalApp.signUp();
                break;
            case 'userWelcome':
                journalWelcomeUser.init();
                break;
            case 'homePage':
                journalHome.init();
                break;
            case 'signIn':
                journalSignIn.init();
                break;
            case 'home-index':
                break;
        }
    },
    signUp: () =>{
        if(localStorage.getItem("darkMode?") === "true"){
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        const googleSignUp = document.querySelector(".google-signIn")
        googleSignUp.onclick = (e) =>{
            e.preventDefault();
            signInWithPopup(auth, provider)
                .then(async (result)=>{
                    const docRef = doc(db,"users",result.user.uid)
                    const docSnap = await getDoc(docRef);
                    if(docSnap.exists()){
                        window.location.href = "/journal/journalHome.html"
                        return;
                    }
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const userUid = result.user.uid;
                    const user = result.user.displayName;
                    await setDoc(doc(db,"users", userUid),{
                        name: result.user.displayName,
                        email: result.user.email
                    })
                    await journalApp.loadUserPrompts(userUid);
                    window.location.href = "/journal/userWelcome.html"
                    }).catch((error) =>{
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                })
        }

        const signUpForm = document.querySelector("#sign-up-form")
        
        signUpForm.addEventListener("submit",(e)=>{
            e.preventDefault();

            // DISPLAY PURPOSES - If any of validations are failed, errors will appear simontaneopusly iosajdfkaljsf;lakw
            journalApp.validateName(signUpForm.firstname.value);
            journalApp.validateEmail(signUpForm.username.value);
            journalApp.validatePassword(signUpForm.password.value);
            journalApp.validateConfirmPassword(signUpForm.password.value,signUpForm.confirmPassword.value)

            // IF any of the validations are failed, the program will stop running.
            if(!journalApp.validateName(signUpForm.firstname.value) || 
            !journalApp.validateEmail(signUpForm.username.value) ||
            !journalApp.validatePassword(signUpForm.password.value) ||
            !journalApp.validateConfirmPassword(signUpForm.password.value,signUpForm.confirmPassword.value)){
                return;
            }

            // If validation passed, data will then be sent to database
            const name = signUpForm.firstname.value;
            const username = signUpForm.username.value
            const password = signUpForm.password.value
            // Creating new user
            createUserWithEmailAndPassword(auth,username,password)
                .then((cred)=>{
                    journalApp.writeUserData(cred.user.uid,name,username)
                })
                .catch((err)=>{
                    const email = document.querySelector("#input-container-username").setAttribute("data-error",err.message)
                })
        });
    },
    // VALIDATIONS FOR USER INPUTS
    validateName: (firstname) =>{
        if(firstname != ""){
            let firstNameError = document.querySelector("#input-container-firstname").removeAttribute("data-error");
            return (true);
        }
        let firstNameError = document.querySelector("#input-container-firstname").setAttribute("data-error","Please enter your first name.")
            return (false);
    },
    validateEmail: (username) =>{
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)){
            let emailError = document.querySelector("#input-container-username").removeAttribute("data-error")
            return (true)
        }
            let emailError = document.querySelector("#input-container-username").setAttribute("data-error","Please enter a valid email address.")
            return (false);
    },
    validatePassword: (password) =>{
        let passwordError = document.querySelector("#input-container-password")
        if(password.length >= 6){
            passwordError.removeAttribute("data-error")
            return (true);
        }else{
            passwordError.setAttribute("data-error","Password must be atleast 6 characters long.")
            return(false);
        }
    },
    validateConfirmPassword: (password, confirmPassword) =>{
        let confirmPasswordError = document.querySelector("#input-container-confirm-password")
        if(password === confirmPassword){
            confirmPasswordError.removeAttribute("data-error")
            return (true);
        }else{
            confirmPasswordError.setAttribute("data-error","Passwords do not match.")
            return(false)
        }
        
    },
    // Writing the user data if they are new to the website.
    writeUserData: async (userId,name,email) => {
        const setUserData = async () =>{
            const colRef = collection(db, "users");
            await setDoc(doc(colRef, userId),{
                name: name,
                email: email,
            })
        }
        await setUserData();
        await journalApp.loadUserPrompts(userId)
        const auth = getAuth();
        await sendEmailVerification(auth.currentUser)
            .then(()=>{
                let interval = setTimeout(()=>{
                    window.location.href = "/journal/userWelcome.html"
                },3000) 
            })

    
    },
    loadUserPrompts: async (userId) =>{
        prompts.forEach(async (prompt)=>{
            let setPrompts = prompt.prompt;
            let tags = prompt.tags
            await setDoc(doc(db, "users", userId, "userPromptsList",setPrompts),{
                tag: tags,
                status: "incomplete"
            })
        })
    }
    


}
journalApp.init();

const journalWelcomeUser = {
    init: () => {
        if(localStorage.getItem("darkMode?") === "true"){
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        document.addEventListener("DOMContentLoaded",journalWelcomeUser.pageScript())
    },
    pageScript: ()=>{
        let nicknameForm = document.querySelector("#nickname-pronouns-form");
        let nicknameBoxValue = document.querySelector("#nickname")
        onAuthStateChanged(auth, (user)=>{
            if(user){
                // Check if user actually confirmed email
                let confirmBtn = document.querySelector(".confirm-btn")
                confirmBtn.onclick = () =>{
                    location.reload();
                    if(user.emailVerified == false){
                        return;
                    }else{
                        document.querySelector(".confirm-email").classList.add("accepted")
                    }
                }
                // If user didn't get the email.
                let reEmail = document.querySelector(".resend-email")
                reEmail.onclick = () =>{
                    sendEmailVerification(auth.currentUser)
                        .then(()=>{
                        })
                }
                if(user.emailVerified === false){
                    return;
                }
                document.querySelector(".confirm-email").classList.add("accepted")
            }
        })
        nicknameForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            if(nicknameBoxValue.value == ""){
                window.location.href = "/journal/journalHome.html"
                return;
            }
            const auth = getAuth();
            const user = auth.currentUser;
            const userId = user.uid;
            // Adding the extra information if provided
            journalWelcomeUser.addExtraInformation(userId,nicknameBoxValue.value)
        })
    },
    // Adds extra information to firestore database, nickname will be used to display users name throughout thousandprompts
    addExtraInformation: async (userId,nickname)=>{
        const colRef = collection(db, "users" + userId)
        const addDocument = async () =>{
            await setDoc(doc(db,"users",userId),{
                nickname: nickname
            },{merge: true})
        }
        await addDocument();
        // Changing page to home html where the journal begins
        window.location.href = "/journal/journalHome.html"
        // let loadingScreen = document.querySelector("#loading-screen");
        // loadingScreen.classList.remove("hidden")

    },
}

const journalHome = {
    init: async () =>{
        if(localStorage.getItem("darkMode?") === "true"){
            document.querySelector("#darkModeEnable").checked = true;
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.querySelector("#darkModeEnable").checked = false;
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        document.addEventListener("DOMContentLoaded",journalHome.pageScript())
    },
    pageScript: () =>{

        if(localStorage.getItem("visited")){
        }else{
            let downloadModal = document.querySelector(".download-app")
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                downloadModal.classList.add("active")
                if(getMobileOperatingSystem() === "iOS"){
                    const downloadBtn = document.querySelector('.download-now-btn');
                    downloadBtn.onclick = () =>{
                        document.querySelector(".wrapper-ios").classList.add("active")
                    }
                }else if(getMobileOperatingSystem() === "Android"){
                    let deferredPrompt;
                    const downloadBtn = document.querySelector('.download-now-btn');
                    window.addEventListener("beforeinstallprompt", ev => { 
                        // Stop Chrome from asking _now_
                        ev.preventDefault();
                        
                        // Keep in mind that this event may be called multiple times, 
                        // so avoid creating multiple buttons!
                        downloadBtn.onclick = () =>{ 
                            ev.prompt()
                            deferredPrompt.userChoice.then((choiceResult) => {
                                if (choiceResult.outcome === 'accepted') {
                                  console.log('User accepted the A2HS prompt');
                                } else {
                                  console.log('User dismissed the A2HS prompt');
                                }
                                deferredPrompt = null;
                              });
                        };
                    });
                }
            }
            localStorage.setItem("visited","true")
        }
        // Check if user is signed in, if signed in, change sign in button to say signout
        let logoClickHomePage = document.querySelector(".logo-text")
        logoClickHomePage.addEventListener("click",()=>{
            window.location.href = "/index.html"
        })
        onAuthStateChanged(auth, (user) => {
            let cbtStatus = true;
            let loadingScreen = document.querySelector("#loading-screen");
            loadingScreen.classList.add("hidden")
            // Settings page
            if(localStorage.getItem("enableCBT?") === "true"){
                document.querySelector("#cbtEnable").checked = true;
                cbtStatus = true;
            }else{
                document.querySelector("#cbtEnable").checked = false;
                cbtStatus = false;
            }

            // If user allows for cbt, store in localstorage
            let allowCBT = document.querySelector("#cbtEnable")
            allowCBT.onclick = ()=>{
                if(allowCBT.checked){
                    cbtStatus = true;
                    localStorage.setItem("enableCBT?","true")
                }else{
                    cbtStatus = false;
                    localStorage.setItem("enableCBT?","false")
                }
            }


            let darkModeSet = document.querySelector("#darkModeEnable");
            darkModeSet.onclick = () =>{
                if(darkModeSet.checked === true){
                    localStorage.setItem("darkMode?","true")
                    document.body.classList.remove("theme-default")
                    document.body.classList.add("theme-dark")
                    return;
                }
                localStorage.setItem("darkMode?","false")
                document.body.classList.remove("theme-dark")
                document.body.classList.add("theme-default")
            }

            let signBtn = document.querySelector("#signInOutBtn");
            let homeScreen = document.querySelector("#homeText")
            // If user is signed in functionality
            if(user){
                // Load rsetPrompts func
                journalHome.resetPrompts();
                // Signout on click
                let signOutBtn = document.querySelector("#signInIcon");
                signOutBtn.addEventListener("click", () => {
                    const auth = getAuth();
                    signOut(auth).then(redirect=>{
                        let loadingScreen = document.querySelector("#loading-screen");
                        loadingScreen.classList.remove("hidden")
                        document.location.reload(true);
                        loadingScreen.classList.add("hidden")
                    })
                });

                //Change sign in text to signout, indicated user is signed in
                signBtn.innerText = "Sign Out"
                journalHome.getUserName().then(result =>{
                    homeScreen.textContent = "Hiya, "+result+"!\n Let's start writing!"
                })
                // --------------Variables

                let usersSelectedCurrentEmotion = "null";
                let usersResponseToCurrentEmotion;
                let usersResponseToPrompt;
                let usersResponseToPriorMood;
                let usersSelectedDistortions = userDistortions;
                // load written prompts
                journalHome.getUserWrittenPrompts();



                // Load Prompts
                journalHome.loadPrompts().then(()=>{
                    journalHome.callObserver();
                })


                // SELECT CURRENT EMOTION SECTION
                let startButton = document.querySelector("#start-writing-button");
                startButton.addEventListener("click", () => {
                // If there are no more prompts, user cann't continue
                if(localStorage.getItem("currentActivePrompt") === "You ran out of prompts!"){
                    return;
                }

                if(cbtStatus === false){
                    // Load desired prompt, set currentMoodParagraph to no entry. 
                    let currentPromptTitle = document.querySelector('.text-wrapper-prompt p')
                    currentPromptTitle.innerHTML = localStorage.getItem("currentActivePrompt")

                    // Since emotions section is being skipped, set null to user response to emotion var
                    usersResponseToCurrentEmotion = "No Entry"
                    document.querySelector("section.user-response-to-prompt").classList.add("active");
                    return;
                }
                let promptListParent = document.querySelector(".java-script-li");
                if (promptListParent.firstElementChild.classList.contains("no-entry")) {
                    return;
                }
                let currentMoodActive = document.querySelector(
                    ".get-current-mood-section"
                );
                currentMoodActive.classList.add("active");
                });

                // CURRENT MOOD SECTION
                const storeCurrentMood = async () =>{
                    // Lets user select an emotion
                    document.querySelectorAll(".emotion-container").forEach(mood =>{
                        mood.addEventListener("click",(clickedMood)=>{
                        document.querySelectorAll(".emotion-container").forEach(container =>{
                            container.classList.remove("active")
                        })


                        // If awful mood or bad is selected, open user distortions list  
                        let usersCurrentEmotion = clickedMood.target.id;
                        if(usersCurrentEmotion === "mood-awful" || usersCurrentEmotion === "mood-sad"){
                            document.querySelector(".distortions-modal").classList.add("active");
                        }
                        switch(usersCurrentEmotion){
                            case("mood-awful"):
                                document.querySelector(".distortions-modal").classList.add("active");
                                document.querySelector('.mood-after-headline').innerText = "Sorry to hear you're feeling awful! How can you challenge this intrusive thought?"
                                break;
                            case("mood-sad"):
                                document.querySelector(".distortions-modal").classList.add("active");  
                                document.querySelector('.mood-after-headline').innerText = "How can you challenge this sad thought? Pretend you're comforting a close friend." 
                                break;
                            case("mood-meh"):
                            document.querySelector('.mood-after-headline').innerText = "We all have our meh days! How can you make this day at least a tiny bit better?"
                                break;
                            case("mood-good"):
                                document.querySelector('.mood-after-headline').innerText = "Glad to hear you're feeling good! Would you like to tell us more?"
                                break;
                            case("mood-amazing"):
                                document.querySelector('.mood-after-headline').innerText = "Amazing! Anything else you would like to add on or go in detail?"
                                break;
                        }
                        clickedMood.target.classList.add("active");
                        usersSelectedCurrentEmotion = clickedMood.target.innerText
                        usersSelectedDistortions = userDistortions;
                        })
                    })

                }
                storeCurrentMood();
                let startWritingBtn = document.querySelector('.start-writing-button')
                startWritingBtn.onclick = ()=>{
                    // If char limit is passed by user, do not submit
                    if(submitCurrentMood === false){
                        return;
                    }
                    // On click, load user desired prompt
                    let currentPromptTitle = document.querySelector('.text-wrapper-prompt p')
                    currentPromptTitle.innerHTML = localStorage.getItem("currentActivePrompt")
                    let userCurrentMoodParagraph = document.querySelector("#current-mood-answer").value

                    // If currentMoodparagraph is empty, store null, and go to next step.
                    if(userCurrentMoodParagraph == ""){
                        usersResponseToCurrentEmotion = "No Entry"
                        document.querySelector("section.user-response-to-prompt").classList.add("active");
                        return;
                    }
                    usersResponseToCurrentEmotion = userCurrentMoodParagraph
                    document.querySelector("section.user-response-to-prompt").classList.add("active");
                }
            
                // USER JOURNALING SECTION
                let journalSubmitBtn = document.getElementById("add-written-prompt")
                journalSubmitBtn.addEventListener("click",()=>{
                    if(submitJournal === false){
                        return;
                    }
                    //User Cannot submit if there is no values
                    let userJournalResponse = document.querySelector("#textarea").value
                    if(userJournalResponse == ""){
                        return
                    }
                    // Storing user response for later adding to database
                    usersResponseToPrompt = userJournalResponse;
                    
                    if(cbtStatus === false || usersResponseToCurrentEmotion === "No Entry"){
                        // End Journaling
                        document.querySelector("#finishJournal").click();
                        return;
                    }
                    
                    if(usersResponseToCurrentEmotion === "No Entry"){
                        // End Journaling
                        usersResponseToPriorMood = "No Entry"
                        document.querySelector("#finishJournal").click();
                        return;
                    }

                    // If this is true then allow for next page, else take to homescreen.

                    // Open last section, mood after, & load prior mood
                    let newMoodSection = document.querySelector(".user-after-feeling").classList.add("active")
                    let loadPriorMood = document.querySelector('.user-prior-current-mood-answer')
                    loadPriorMood.innerText = usersResponseToCurrentEmotion;
                })

                // Finish journal - Add document, delete current prompt from prompt list.
                // GET MOOD AFTER SECTION
                let finishJournal = document.querySelector("#finishJournal");
                finishJournal.onclick = ()=>{
                    if(submitMoodAfter === false){
                        return;
                    }
                    let newMoodResponse = document.querySelector("#new-mood-reponse").value
                    usersResponseToPriorMood = newMoodResponse;

                    const addUserJournal = async () =>{
                        const addDocument = async () =>{
                            // referencing the prompts section
                            let prompt = localStorage.getItem("currentActivePrompt");

                            // Setting document in database
                            const promptDocRef = doc(db,"users",journalHome.getUserId(),"userPromptsList",prompt);
                            await updateDoc(promptDocRef,{
                                Date: Date(),
                                MoodBefore: usersSelectedCurrentEmotion,
                                MoodBeforeResponse: usersResponseToCurrentEmotion,
                                distortions: usersSelectedDistortions,
                                promptResponse: usersResponseToPrompt,
                                MoodAfterResponse: usersResponseToPriorMood
                            },{merge: true})


                            // Function removes current prompt from being displayed
                            const removeCurrentPrompt = async () =>{
                                let currentPrompt = localStorage.getItem("currentActivePrompt");
                                const docRef = doc(db, "users", journalHome.getUserId(),"userPromptsList",currentPrompt);
                                const docSnap = await getDoc(docRef);
                                await updateDoc(docRef, {
                                    status: deleteField()
                                })
                               journalHome.loadPrompts();
                            }
                            removeCurrentPrompt();
                        }
                        // Await for addDocument, then close the journals section as well as change the home text to random.
                        await addDocument()
                        journalHome.getUserWrittenPrompts();
                        journalHome.resetHome();

                        // Get a new title to display
                        let newHomeTitleText = document.querySelector("#homeText").innerText = journalHome.afterSubmitionText("signedIn");
                    }
                    // Adding user journal to database collection 
                    addUserJournal();
                    journalHome.getUserWrittenPrompts();
                    usersSelectedCurrentEmotion = "null";
                }
            }else{
                // If user is signed out functionality
                signBtn.innerText = "Sign In"
                homeScreen.innerText = "Hi! Let's journal today!"

                // Location href change on sign in or signout
                let signInBtn = document.querySelector("#signInIcon");
                signInBtn.onclick = () => {
                    let loadingScreen = document.querySelector("#loading-screen");
                    loadingScreen.classList.remove("hidden")
                    location.href = "/journal/signin.html";
                    let timeout = setTimeout(()=>{
                        loadingScreen.classList.add("hidden")
                    },1000)
                };


                let outOfPrompts = false;
                // Create prompts if it's users first time, else use already created prompts
                if(!localStorage.getItem("userPromptList")){
                    let prompts =[
                        {
                            // 1
                            prompt: "What's an important life lesson you have learned this year? If not this year, the year prior?",
                            tags: "Thought Provoking"
                        },
                        {   
                            // 2
                            prompt: "Do you tend to make decisions from your head or your heart? Do you believe one method is better than the other? Why or why not?",
                            tags: "Thought Provoking"
                        },
                        {
                            // 3
                            prompt: "What's something you're insecure about? Where does this insecurity come from? Why does this quality matter to you?",
                            tags: "Thought Provoking"
                        },
                        {
                            // 4
                            prompt: "When someone makes you angry, how do you usually react? Do you think it's a healthy response? Why or why not?",
                            tags: "Thought Provoking"
                        },
                        {
                            // 5
                            prompt:"Write about a time when your perspective completely changed. What impact did this event have on you?",
                            tags: "Thought Provoking"
                        },
                        {
                            // 6
                            prompt:"What does it mean to truly be happy? Without materialistic things, how do you see yourself becoming happier?",
                            tags: "Feel Good"
                        },
                        {
                            // 7
                            prompt:"Write about something that is going well in youre life right now and how it affects you.",
                            tags: "Feel Good"
                        },
                        {
                            // 8
                            prompt:"Name a time you truly felt hurt by someone, go in detail. If you forgave them, how did your life change, if not, how could your life be if you did forgive them?",
                            tags: "Gratitude"
                        },
                        {
                            // 9
                            prompt:"Write about something that you've never really gotten over. How does the experience continue to bother you?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 10
                            prompt:"If your house was on fire and you could save only two personal possessions (people and animals are safe!), what would you grab, why are these important to you?",
                            tags:"Gratitude"
                        },
                        {
                            // 12
                            prompt:"Imagine your ideal life in 10 years, what's your life like, go in detail. Ask yourself, what's stopping you from achieving this goal?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 13
                            prompt:"Without doubting yourself, what's something you can say you do better than most people around you?",
                            tags:"Feel Good"
                        },
                        {
                            // 14
                            prompt:"If you can change anything about yourself, what would it be?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 14
                            prompt:"Describe the worst breakup you've had, do you remember the feeling when it first happened? How much have you grown since then?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 15
                            prompt:"How would you like to be remembered?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 16
                            prompt:"What are a couple things that make you happy? How often do you find yourself showing gratitude for these things?",
                            tags:"Gratitude"
                        },
                        {
                            // 17
                            prompt:"If you had all the money in the world, what would you do with it? Would you donate to a charity? Help your friends or family? Go in detail.",
                            tags:"Feel Good"
                        },
                        {
                            // 18
                            prompt:"Is there anyone you could forgive? How would your life be different if you could forgive this person? Would your life be better or worse?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 19
                            prompt:"Is there something you regret till this day?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 20
                            prompt:"What was your favorite video game as a kid, do you still play it?",
                            tags:"Feel Good"
                        },
                        {
                            // 21
                            prompt:"What's the nicest thing someone has ever done for you? How often do you think about it?",
                            tags:"Feel Good"
                        },
                        {
                            // 22
                            prompt:"What is your idea of happiness?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 23
                            prompt:"What have you been able to accomplish this year that you are really proud of?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 24
                            prompt:"How do you strive to be similar to, or different from, your parents?",
                            tags:"Thought Provoking"
                        },
                        {
                            // 25
                            prompt:"Write about the hardest decision you've ever had to make.",
                            tags:"Thought Provoking"
                        },
                        {
                            // 26
                            prompt:"When you think about the future, what do you fear the most? What do you hope for the most?",
                            tags:"Feel Good"
                        },
                        {
                            // 27
                            prompt:"When's a time you thought something seemed impossible but succeeded in the end? How did you feel after?",
                            tags:"Feel Good"
                        },
                        {
                            // 28
                            prompt:"Describe who you're grateful for, if you could help them in anyway, how would you?",
                            tags:"Gratitude"
                        },
                        {
                            // 29
                            prompt:"What's something that happened today that you're super grateful for? It could be anything small or big!",
                            tags:"Gratitude"
                        },
                        {
                            // 30
                            prompt:"Do the words 'I'm ugly' mean anything to you? Begin by writing a message of compassion to yourself, valuing yourself beyond superficial judgments.",
                            tags:"Thought Provoking"
                        },
                        
                    ]
                    localStorage.setItem("userPromptList",JSON.stringify(prompts));
                    let loadLocalStoragePrompts = JSON.parse(localStorage.getItem("userPromptList"))
                    let template = '';
                    loadLocalStoragePrompts.forEach(li=>{
                        template = `
                            <li class = "li-item ${getFilterName(li.tags)}">${li.prompt}</li>
                        `
                        let promptsContainer = document.querySelector('#list-items-js')
                        promptsContainer.innerHTML += template;
                    });
                }else{
                    let loadLocalStoragePrompts = JSON.parse(localStorage.getItem("userPromptList"))
                    let template = '';
                    loadLocalStoragePrompts.forEach(li=>{
                        template = `
                            <li class = "li-item ${getFilterName(li.tags)}">${li.prompt}</li>
                        `
                        let promptsContainer = document.querySelector('#list-items-js')
                        promptsContainer.innerHTML += template;
                    });
                }
                function getFilterName(name){
                    switch(name){
                        case "Thought Provoking":
                            return "thought-provoking"
                        case "Feel Good":
                            return "feel-good";
                        case "Gratitude":
                            return "gratitude"
                    }
                }

                // If user is out of prompts
                if(localStorage.getItem("userPromptList") === "[]"){
                    let template = '';
                    template = `
                        <li class = "li-item">You ran out of prompts!</li>
                    `
                    let promptsContainer = document.querySelector('#list-items-js')
                    promptsContainer.innerHTML += template;
                    outOfPrompts = true;
                    journalHome.callObserver();
                }


                // Creating filter functionality
                let filterBox = document.querySelectorAll(".filter-box");
                let filters = [];
                filterBox.forEach(filter =>{
                    filter.onclick = () =>{
                        filters = [];
                        if(filter.classList.contains("disabled")){
                            filter.classList.remove("disabled")
                            filterBox.forEach(filter =>{
                                if(!filter.classList.contains("disabled")){
                                    filters.push(filter.innerHTML);
                                }
                            })
                            displayFilters();
                            return
                        }
                        filters = [];
                        filter.classList.add("disabled")
                        filterBox.forEach(filter =>{
                            if(!filter.classList.contains("disabled")){
                                filters.push(filter.innerHTML);
                            }
                        })
                        displayFilters();
                        function displayFilters(){
                            let prompts = document.querySelectorAll(".li-item")
                            prompts.forEach(prompt =>{
                                prompt.style.display = "none"
                            })
                            filters.forEach(filter =>{
                                let filterName = getFilterName(filter);
                                prompts.forEach(prompt =>{
                                    if(prompt.classList.contains(filterName)){
                                        switch(filterName){
                                            case ("gratitude"):
                                                prompt.style.color = "rgb(202, 136, 14)"
                                                prompt.style.display = "";
                                                return;
                                            case ("feel-good"):
                                                prompt.style.color = "rgb(76, 156, 76)"
                                                prompt.style.display = "";
                                                return;
                                                case ("thought-provoking"):
                                                prompt.style.color = "rgb(95, 157, 199)"
                                                prompt.style.display = "";
                                                return;
                                        }
                                        prompt.style.display = "";
                                        return
                                    }
                                })
                                
                            })
                        }
                    }
                })

                // Load Observer
                journalHome.callObserver();

                // Load Writtenprompts
                loadWrittenPrompts();
                viewJournals();

                // On "Let's start writing" click, check if cbt concept is on, if yes, take to next page, else take to journal
                let startWritingBtn = document.querySelector("#start-writing-button");
                startWritingBtn.onclick = ()=>{
                    if(outOfPrompts){
                        return;
                    }

                    if(cbtStatus === false){
                        // Setting up the journal page. Change title text to prompt. 
                        let currentPromptTitle = document.querySelector('.text-wrapper-prompt p').innerHTML = localStorage.getItem("currentActivePrompt");

                        // No current mood was written since CBT status if false, pass no entry & add active to write journal section
                        localStorage.setItem("userCurrentMoodParagraph","No Entry")
                        document.querySelector("section.user-response-to-prompt").classList.add("active");


                        // Get the user prompts is user was previously signed in or create a blank array if user is new.
                        let userPromptsContainer = JSON.parse(localStorage.getItem("storedJournals")) || [];
                        // Event listener on button
                        let userSubmitPrompt = document.querySelector("#add-written-prompt")
                        userSubmitPrompt.onclick = ()=>{
                            // Storing prompt and response in an object, will be stored in local storage.
                            let userResponseToPrompt = document.querySelector("#textarea").value
                            if(userResponseToPrompt.value === ""){
                                return;
                            }
                            let today = new Date();
                            let newJournal = {
                                prompt: localStorage.getItem("currentActivePrompt"),
                                promptAnswer: userResponseToPrompt,
                                date: today,
                                distortions: "null",
                                currentEmotion: "null",
                                currentMoodParagraph: "null",
                                moodAfter: "null"
                            }

                            // Push new journal into prompt container
                            userPromptsContainer.push(newJournal);

                            // Override old local storage array with new array with user's new journal
                            localStorage.setItem("storedJournals",JSON.stringify(userPromptsContainer));

                            // Delete prompt from local storage.
                            const updatedPromptList = JSON.parse(localStorage.getItem("userPromptList"));
                            const objectNumberReference = updatedPromptList.findIndex(object =>{
                                return object.prompt === localStorage.getItem("currentActivePrompt")
                            })
                            updatedPromptList.splice(objectNumberReference,1)

                            // Overridue previous prompt list array with new array and reload the displayed prompts;
                            localStorage.setItem("userPromptList",JSON.stringify(updatedPromptList));

                            //Remove old prompts
                            let promptsContainer = document.querySelector('#list-items-js').innerHTML = ""

                            // Loading updated prompt into container
                            let loadLocalStoragePrompts = JSON.parse(localStorage.getItem("userPromptList"))
                            let template = '';
                            loadLocalStoragePrompts.forEach(li=>{
                                template = `
                                    <li class = "li-item ${getFilterName(li.tags)}">${li.prompt}</li>
                                `
                                let promptsContainer = document.querySelector('#list-items-js')
                                promptsContainer.innerHTML += template;
                            });
                            journalHome.callObserver();
                            loadWrittenPrompts();
                            viewJournals();
                            resetHome();
                        }
                        return;
                    }
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    // CBT = TRUE FUNCTION---------------------------------------------------------------------------------------------------------------------
                    let currentEmotion; //Store current emotion in here.
                    let currentMoodResponse; //Store Current Mood Response.
                    let isCurrentMoodResponseEmpty = false; //if this is true, finish journal without sending to after mood response
                    let usersPromptResponse;


                    let currentMoodActive = document.querySelector(
                        ".get-current-mood-section"
                    );
                    currentMoodActive.classList.add("active");
                    
                    // If user selects a mood, if not, storage should be set to no entry.
                    let emotions = document.querySelectorAll(".emotion-container");
                    emotions.forEach(emotion =>{
                        emotion.addEventListener("click",(container)=>{
                            emotions.forEach(emotion =>{
                                emotion.classList.remove("active")
                            })
                            if(!container.target.classList.contains("active")){
                                container.target.classList.add("active");
                                currentEmotion = container.target.innerText;
                                // localStorage.setItem("usersCurrentMood",container.target.innerText)
                                return;
                            }
                            container.target.classList.add("active");
                            return;
                        })
                        currentEmotion = "null"
                    })
                    let currentMoodTextArea = document.getElementById("current-mood-answer");


                    // On current mood page, button click; send user to next page, answer to prompt
                    let currentMoodStartWritingBtn = document.querySelector(".start-writing-button")
                    currentMoodStartWritingBtn.addEventListener("click",()=>{
                        if(submitCurrentMood === false){
                            return;
                        }
                        // Store users current mood response // rant
                        currentMoodResponse = currentMoodTextArea.value
                        if(currentMoodResponse === ""){
                            isCurrentMoodResponseEmpty = true;
                        }

                        // Setting up next page for user.
                        let setPromptTitle = document.querySelector('.text-wrapper-prompt p')
                        setPromptTitle.innerHTML = localStorage.getItem("currentActivePrompt")
                        let userReponseToPromptPage = document.querySelector(".user-response-to-prompt").classList.add("active");
                    })

                    // On click, save journal, if current mood response was empty, finish journal, else set up page for mood after page.
                    let finishJournalBtn = document.querySelector("#add-written-prompt");
                    finishJournalBtn.onclick = ()=>{
                        let userResponseToPrompt = document.querySelector("#textarea");
                        userResponseToPrompt.value;

                        // Cannot submit journal if its passed char limit
                        if(submitJournal === false){
                            return;
                        }

                        // Cannot submit if journal is empty.
                        if(userResponseToPrompt.value === ""){
                            return;
                        }

                        // Storing user response
                        usersPromptResponse = userResponseToPrompt.value;
                        if(isCurrentMoodResponseEmpty){
                            // Set up code to finish journal instead of sending to next page
                            addPromptToLocalStorage(usersPromptResponse,currentEmotion,currentMoodResponse, "null", userDistortions);
                            return;
                        }
                        let afterMoodHeadline = document.querySelector(".mood-after-headline")
                        switch(currentEmotion){
                            case 'Awful':
                                afterMoodHeadline.innerHTML = "Sorry to hear you were feeling awful, how can you challenge this thought?"
                                break;
                            case 'Bad':
                                afterMoodHeadline.innerHTML = "Let's reframe this bad thought. Pretend you're comforting a child or a close friend."
                                break;
                            case 'Meh':
                                afterMoodHeadline.innerHTML = "We all have our meh days! What could make this day better for you?"
                                break;
                            case 'Good':
                                afterMoodHeadline.innerHTML = "Awesome to hear you're feeling good! Wanna explain some more?"
                                break;
                            case 'Amazing':
                                afterMoodHeadline.innerHTML = "Hope you're day stays amazing! Want to tell us some more? "
                                break;
                            default:
                                break;
                        }
                        let displayPriorMoodText = document.querySelector(".user-prior-current-mood-answer").innerHTML = currentMoodResponse;
                        let getUsersMoodAfter = document.querySelector(".user-after-feeling").classList.add("active");
                    }


                    // Reference text area for mood after response and store in a different variable
                    let newMoodResponseTextArea = document.querySelector("#new-mood-reponse")
                    // Reference button, on click, call addprompt function.
                    let endJournal = document.querySelector("#finishJournal");
                    endJournal.onclick = ()=>{
                        // Cannot submit if passed char
                        if(submitMoodAfter === false){
                            return;
                        }
                        let newMoodParagraph = newMoodResponseTextArea.value;
                        addPromptToLocalStorage(usersPromptResponse,currentEmotion,currentMoodResponse, newMoodParagraph, userDistortions);
                        return;
                    }
                }

                // FUNCTIONS 

                function loadWrittenPrompts(){
                    let distortionsArr = [];
                    if(localStorage.getItem("storedJournals") === "[]" || !localStorage.getItem("storedJournals")){
                        let removeHiddenFromUserWrittenCollection = document.querySelector('.entries-collection-container').classList.add("hidden") 
                        return;
                    }
                    if(localStorage.getItem("storedJournals")){
                        const entriesCollectionRef = document.querySelector(".entries-collection")
                        entriesCollectionRef.innerHTML = "";
                        let displayWrittenPrompts = JSON.parse(localStorage.getItem("storedJournals"))
                        let removeHiddenFromUserWrittenCollection = document.querySelector('.entries-collection-container').classList.remove("hidden")
                        let insideViewBox = '';
                        let distortionsList ='';
                        let viewBox = '';
                        displayWrittenPrompts.forEach(prompt =>{
                            insideViewBox = `
                                <p class = "user-prompt-title">${prompt.prompt}</p>
                                <p class = "user-prompt-answer no-display-text">${prompt.promptAnswer}</p>
                                <p class = "emotion-display no-display-text">${prompt.currentEmotion}</p>
                                <p class = "emotion-response-display no-display-text">${prompt.currentMoodParagraph}</p>
                                <p class = "mood-after-display no-display-text">${prompt.moodAfter}</p>
                                <p class = "date-display no-display-text">${prompt.date}</p>
                            `

                            if(prompt.distortions === "null"){
                                viewBox += `
                                <div class = "user-journal-box viewBox cbt-disabled mood-box-${prompt.currentEmotion}" id = "hidden">
                                    ${insideViewBox}
                                </div>
                                `
                                return;
                            }
                            prompt.distortions.forEach(distortion =>{
                                distortionsList += `
                                    <p class = "distortion-display no-display-text">${distortion}</p>
                                `
                            })

                            viewBox += `
                                <div class = "user-journal-box cbt-enabled viewBox mood-box-${prompt.currentEmotion}" id = "hidden">
                                   ${insideViewBox}
                                   ${distortionsList}
                                </div>
                            `
                            return;
                            
                        })
                        entriesCollectionRef.innerHTML += viewBox;
                    }
                    viewJournals();
                }
                function viewJournals(){
                    let viewBoxs = document.querySelectorAll(".viewBox")
                    let count;
                    const deleteButtonStyling = () =>{
                        let deleteBtn = document.querySelector("#deleteJournal")
                        deleteBtn.classList.remove("confirmation")
                        deleteBtn.innerText = "Delete Entry"
                        count = 0;
                    }
                    viewBoxs.forEach(box =>{
                        box.onclick = (journal)=>{  
                            let currentMoodTitle = document.querySelector("#current-mood-title") 
                            let currentMoodContainer = document.querySelector("#current-mood-container") 
                            let afterMoodTitle = document.querySelector("#after-mood-title") 
                            let afterMoodContainer = document.querySelector("#after-mood-container") 
                            if(journal.target.classList.contains("cbt-disabled")){
                                currentMoodTitle.classList.add("hide-item")
                                currentMoodContainer.classList.add("hide-item")
                                afterMoodTitle.classList.add("hide-item")
                                afterMoodContainer.classList.add("hide-item")
                            }else{
                                currentMoodTitle.classList.remove("hide-item")
                                currentMoodContainer.classList.remove("hide-item")
                                afterMoodTitle.classList.remove("hide-item")
                                afterMoodContainer.classList.remove("hide-item")
                            }
                            deleteButtonStyling();
                            let targetDate = journal.target.querySelector(".date-display")
                            let targetTitle = journal.target.querySelector(".user-prompt-title")
                            let targetAnswer = journal.target.querySelector(".user-prompt-answer");
                            let targetEmotion = journal.target.querySelector(".emotion-display")
                            let targetEmotionResponse = journal.target.querySelector(".emotion-response-display")
                            let targetEmotionAfter = journal.target.querySelector(".mood-after-display")


                            let date = targetDate.innerText;
                            let formatDate = new Date(date);
                            let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
                            let month = months[formatDate.getMonth()]
                            let day = formatDate.getUTCDate()
                            let year = formatDate.getUTCFullYear()
                            let time = formatDate.toLocaleTimeString('en-us')
                            let combineDate = month+"/"+day+"/"+year+"  "+time;



                            let title = targetTitle.innerText;
                            let answer = targetAnswer.innerText;
                            let emotionName = targetEmotion.innerText;
                            let emotionResponse = targetEmotionResponse.innerText;
                            let emotionAfterResponse = targetEmotionAfter.innerText;

                            // Removing class hidden from displayprompt box
                            let displayPromptBox = document.querySelector('.display-user-journal'); 
                            displayPromptBox.classList.remove("hidden")

                            // Changing title display to given title display this goes for responseDisplay aswell
                            let dateDisplay = document.querySelector(".javascript-input-textfield").innerText = combineDate;
                            let titleDisplay = document.querySelector("#prompt-title-display").innerText = title;
                            let responseDisplay = document.querySelector("#prompt-answer-display").innerText = answer;
                            let emotionDisplay = document.querySelector("#modal-current-emotion").innerText = (emotionName === "null") ? "No Selected Emotion" : emotionName
                            let emotionResponseDisplay = document.querySelector("#modal-current-emotion-response").innerText = emotionResponse
                            let emotionAfterResponseDisplay = document.querySelector('#modal-after-emotion').innerText = emotionAfterResponse;
                        }
                        let deleteBtn = document.querySelector("#deleteJournal")
                        deleteBtn.onclick = async function(e){
                            count +=1;
                            if(count === 1){
                                deleteBtn.classList.add("confirmation")
                                deleteBtn.innerText = "Are you sure?"
                                return;
                            }
                            deleteButtonStyling();
                            deletePrompt(e);
                        }
                    })
                    return;
                }

                function deletePrompt(e){
                    let parentOfBtn = e.target.parentElement
                    let grandParentOfBtn = parentOfBtn.parentElement
                    let getTitlePrompt = grandParentOfBtn.querySelector("#prompt-title-display").innerText;

                    const deleteJournalRef = JSON.parse(localStorage.getItem("storedJournals"));
                    const objectNumberReference = deleteJournalRef.findIndex(object =>{
                    return object.prompt === getTitlePrompt;
                    })

                    deleteJournalRef.splice(objectNumberReference,1)
                    localStorage.setItem("storedJournals",JSON.stringify(deleteJournalRef));

                    // Remove current Journal display
                    let displayPromptBox = document.querySelector('.display-user-journal'); 
                    displayPromptBox.classList.add("hidden")

                    loadWrittenPrompts();
                    viewJournals();
                }

                let today = new Date();
                const addPromptToLocalStorage = (userResponse, currentEmotion, currentMoodParagraph, moodAfterParagraph, distortions)=> {
                    let userPromptsContainer = JSON.parse(localStorage.getItem("storedJournals")) || [];
                    let newJournal = {
                        date: today,
                        prompt: localStorage.getItem("currentActivePrompt"),
                        promptAnswer: userResponse,
                        distortions: distortions,
                        currentEmotion: currentEmotion,
                        currentMoodParagraph: currentMoodParagraph,
                        moodAfter: moodAfterParagraph
                    }

                    // Push new journal into prompt container
                    userPromptsContainer.push(newJournal);

                    // Override old local storage array with new array with user's new journal
                    localStorage.setItem("storedJournals",JSON.stringify(userPromptsContainer));

                    // Delete prompt from local storage.
                    const updatedPromptList = JSON.parse(localStorage.getItem("userPromptList"));
                    const objectNumberReference = updatedPromptList.findIndex(object =>{
                        return object.prompt === localStorage.getItem("currentActivePrompt")
                    })
                    updatedPromptList.splice(objectNumberReference,1)

                    // Overridue previous prompt list array with new array and reload the displayed prompts;
                    localStorage.setItem("userPromptList",JSON.stringify(updatedPromptList));

                    //Remove old prompts
                    let promptsContainer = document.querySelector('#list-items-js').innerHTML = ""

                    // Loading updated prompt into container)
                    let loadLocalStoragePrompts = JSON.parse(localStorage.getItem("userPromptList"))
                    let template = '';
                    loadLocalStoragePrompts.forEach(li=>{
                        template = `
                            <li class = "li-item ${getFilterName(li.tags)}">${li.prompt}</li>
                        `
                        let promptsContainer = document.querySelector('#list-items-js')
                        promptsContainer.innerHTML += template;
                    });
                    if(localStorage.getItem("userPromptList") === "[]"){
                        let template = '';
                        template = `
                            <li class = "li-item">You ran out of prompts!</li>
                        `
                        let promptsContainer = document.querySelector('#list-items-js')
                        promptsContainer.innerHTML += template;
                        outOfPrompts = true;
                        journalHome.callObserver();
                        loadWrittenPrompts();
                        viewJournals();
                        resetHome();
                        return;
                    }
                    journalHome.callObserver();
                    loadWrittenPrompts();
                    viewJournals();
                    resetHome();
                    return;
                }

                const resetHome = () =>{
                    // SETTING VARIABLES {ONCE SUBMIT IS CLICKED: RETURN TO HOME PAGE / REMOVE JOURNAL WRITING SECTION}
                    let journalModal = document.querySelector(".write-journal");
                    let homeScreen = document.querySelector(".home-journal-entries-options");
                    let newMoodPage = document.querySelector(".user-after-feeling");
                    let header = document.querySelector("header");
                    let currentMoodActive = document.querySelector(".get-current-mood-section")
                    let userResponsePage = document.querySelector(".user-response-to-prompt");
            
                    // Remove currentmood page
                    
                    // >>>>FUNCTIONALITY: RESETTING TO SUIT HOME 
                    currentMoodActive.classList.remove("active");
                    userResponsePage.classList.remove("active")
                    newMoodPage.classList.remove("active")
                    journalModal.classList.remove("active");
                    homeScreen.classList.remove("journal-active");
                    let homeScreenText = document.querySelector(".home-text").classList.remove("journal-active");
                    journalModal.classList.remove("journal-active");
                    entriesBtn.classList.remove("unavailable");
                    header.classList.remove("header-hide")
            
                    // Remove any active classes in current mood.
                    document.querySelectorAll(".emotion-container").forEach(mood =>{
                        document.querySelectorAll(".emotion-container").forEach(container =>{
                            container.classList.remove("active")
                        })
                    })
            
                    // Remove previous responses.
                    let userJournalResponse = document.querySelector("#textarea").value = "" //remove input from journal entry textarea
                    let currentMoodResponse = document.querySelector(".current-mood-answer").value = ""
                    let newMoodResponse = document.querySelector(".new-mood-response-textarea").value = ""
                }

                function resetJournals(){
                    let resetBtn = document.querySelector(".delete-prompts-btn");
                    resetBtn.onclick = () =>{
                        let promptsContainer = document.querySelector('#list-items-js').innerHTML ='';
                        localStorage.removeItem("currentActivePrompt");
                        localStorage.removeItem("storedJournals");
                        localStorage.removeItem("userPromptList");
                        localStorage.removeItem("userCurrentMoodParagraph")
                        document.querySelector("section.entries-display").classList.add('hidden')
                        let prompts =[
                            {
                                // 1
                                prompt: "What's an important life lesson you have learned this year? If not this year, the year prior?",
                                tags: "Thought Provoking"
                            },
                            {   
                                // 2
                                prompt: "Do you tend to make decisions from your head or your heart? Do you believe one method is better than the other? Why or why not?",
                                tags: "Thought Provoking"
                            },
                            {
                                // 3
                                prompt: "What's something you're insecure about? Where does this insecurity come from? Why does this quality matter to you?",
                                tags: "Thought Provoking"
                            },
                            {
                                // 4
                                prompt: "When someone makes you angry, how do you usually react? Do you think it's a healthy response? Why or why not?",
                                tags: "Thought Provoking"
                            },
                            {
                                // 5
                                prompt:"Write about a time when your perspective completely changed. What impact did this event have on you?",
                                tags: "Thought Provoking"
                            },
                            {
                                // 6
                                prompt:"What does it mean to truly be happy? Without materialistic things, how do you see yourself becoming happier?",
                                tags: "Feel Good"
                            },
                            {
                                // 7
                                prompt:"Write about something that is going well in youre life right now and how it affects you.",
                                tags: "Feel Good"
                            },
                            {
                                // 8
                                prompt:"Name a time you truly felt hurt by someone, go in detail. If you forgave them, how did your life change, if not, how could your life be if you did forgive them?",
                                tags: "Gratitude"
                            },
                            {
                                // 9
                                prompt:"Write about something that you've never really gotten over. How does the experience continue to bother you?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 10
                                prompt:"If your house was on fire and you could save only two personal possessions (people and animals are safe!), what would you grab, why are these important to you?",
                                tags:"Gratitude"
                            },
                            {
                                // 12
                                prompt:"Imagine your ideal life in 10 years, what's your life like, go in detail. Ask yourself, what's stopping you from achieving this goal?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 13
                                prompt:"Without doubting yourself, what's something you can say you do better than most people around you?",
                                tags:"Feel Good"
                            },
                            {
                                // 14
                                prompt:"If you can change anything about yourself, what would it be?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 14
                                prompt:"Describe the worst breakup you've had, do you remember the feeling when it first happened? How much have you grown since then?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 15
                                prompt:"How would you like to be remembered?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 16
                                prompt:"What are a couple things that make you happy? How often do you find yourself showing gratitude for these things?",
                                tags:"Gratitude"
                            },
                            {
                                // 17
                                prompt:"If you had all the money in the world, what would you do with it? Would you donate to a charity? Help your friends or family? Go in detail.",
                                tags:"Feel Good"
                            },
                            {
                                // 18
                                prompt:"Is there anyone you could forgive? How would your life be different if you could forgive this person? Would your life be better or worse?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 19
                                prompt:"Is there something you regret till this day?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 20
                                prompt:"What was your favorite video game as a kid, do you still play it?",
                                tags:"Feel Good"
                            },
                            {
                                // 21
                                prompt:"What's the nicest thing someone has ever done for you? How often do you think about it?",
                                tags:"Feel Good"
                            },
                            {
                                // 22
                                prompt:"What is your idea of happiness?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 23
                                prompt:"What have you been able to accomplish this year that you are really proud of?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 24
                                prompt:"How do you strive to be similar to, or different from, your parents?",
                                tags:"Thought Provoking"
                            },
                            {
                                // 25
                                prompt:"Write about the hardest decision you've ever had to make.",
                                tags:"Thought Provoking"
                            },
                            {
                                // 26
                                prompt:"When you think about the future, what do you fear the most? What do you hope for the most?",
                                tags:"Feel Good"
                            },
                            {
                                // 27
                                prompt:"When's a time you thought something seemed impossible but succeeded in the end? How did you feel after?",
                                tags:"Feel Good"
                            },
                            {
                                // 28
                                prompt:"Describe who you're grateful for, if you could help them in anyway, how would you?",
                                tags:"Gratitude"
                            },
                            {
                                // 29
                                prompt:"What's something that happened today that you're super grateful for? It could be anything small or big!",
                                tags:"Gratitude"
                            },
                            {
                                // 30
                                prompt:"Do the words 'I'm ugly' mean anything to you? Begin by writing a message of compassion to yourself, valuing yourself beyond superficial judgments.",
                                tags:"Thought Provoking"
                            },
                            
                        ]
                        localStorage.setItem("userPromptList",JSON.stringify(prompts));
                        let loadLocalStoragePrompts = JSON.parse(localStorage.getItem("userPromptList"))
                        let template = '';
                        loadLocalStoragePrompts.forEach(li=>{
                            template = `
                                <li class = "li-item ${getFilterName(li.tags)}">${li.prompt}</li>
                            `
                            let promptsContainer = document.querySelector('#list-items-js')
                            promptsContainer.innerHTML += template;
                        });
                        journalHome.callObserver()
                        document.querySelector(".reset-warning").classList.add("hidden")
                    }
                }
                resetJournals();
                return;
            }

            let journalButtonClick = document.querySelector(".journal-section")

        })
    },
    // =================================FUNCTIONS FOR JOURNAL HOME HTML================================
    getUserName: async () =>{
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;
        const ref = doc(db, "users",userId);
        const docSnap = await getDoc(ref);
        if(docSnap.exists()){
            if(docSnap.data().nickname === undefined){
                return docSnap.data().name
            }
            return docSnap.data().nickname
        }
    },
    getUserId: () =>{
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user.uid;
        return userId;
    },
    // If user is signed in, display a specific set of texts after submition {Display functioning only}
    afterSubmitionText: (userAuthStatus) =>{
        const signedInTextOpt = [
            "Would you like to look at your entries?"
            ,"What a beautiful day to journal!"
            ,"Your journal is safe with me!"
            ,"thousandprompts, by ed.d.d..d.d.d.d.d."
            ,"Another, another prompt!"
            ,"Another prompt? =)"
        ]

        const signedOutTextOpt = [
            "Sign in for more deep prompts!"
            ,"Hi stranger, let's get to know each other? \nSign in!"
        ]
        if(userAuthStatus == "signedIn"){
            let randNumSignIn = Math.floor(Math.random() * signedInTextOpt.length)
            return signedInTextOpt[randNumSignIn];
        }else{
            let randNumSignOut = Math.floor(Math.random() * signedOutTextOpt.length)
            return signedInTextOpt[randNumSignOut];
        }
    },
    getUserWrittenPrompts: async () => {
        const entriesCollectionRef = document.querySelector(".entries-collection")
        entriesCollectionRef.innerHTML = "";
        let lastVisible = null;
        let insideViewBox = '';
        let distortionsList ='';
        let viewBox = '';
        const getNextPrompts = async () =>{
            let userId = journalHome.getUserId();
            const firstSetOfData = query(collection(db, "users",journalHome.getUserId(),"userPromptsList"), orderBy("Date"), startAfter(lastVisible),limit(25));
            const data = await getDocs(firstSetOfData);
            const entriesCollectionRef = document.querySelector(".entries-collection")
            if(data.docs.length === 0 && !entriesCollectionRef.hasChildNodes()){
                let removeHiddenFromUserWrittenCollection = document.querySelector('.entries-collection-container').classList.add("hidden")
                return;
            }
            entriesCollectionRef.innerHTML = "";
            let displayWrittenPrompts = JSON.parse(localStorage.getItem("storedJournals"))
            let removeHiddenFromUserWrittenCollection = document.querySelector('.entries-collection-container').classList.remove("hidden")
            data.docs.forEach(doc =>{
                console.log(doc.data())
                // <div class = "user-journal-box viewBox mood-box-${doc.data().MoodBefore}" id = "hidden">
                insideViewBox = `
                        <p class = "user-prompt-title" id = "prompt-title-display">${doc.id}</p>
                        <p class = "user-prompt-answer no-display-text">${doc.data().promptResponse}</p>
                        <p class = "emotion-display no-display-text">${doc.data().MoodBefore}</p>
                        <p class = "emotion-response-display no-display-text">${doc.data().MoodBeforeResponse}</p>
                        <p class = "mood-after-display no-display-text">${doc.data().MoodAfterResponse}</p>
                `
                console.log(doc.data())
                if(doc.data().MoodBeforeResponse == "No Entry"  || doc.data().MoodBefore == "null"){
                    viewBox += `
                    <div class = "user-journal-box viewBox cbt-disabled mood-box-${doc.data().MoodBefore}" id = "hidden">
                        ${insideViewBox}
                    </div>
                    `
                    return;
                }

                doc.data().distortions.forEach(distortion =>{
                    distortionsList += `
                        <p class = "distortion-display no-display-text">${distortion}</p>
                    `
                })

                viewBox += `
                    <div class = "user-journal-box cbt-enabled viewBox mood-box-${doc.data().MoodBefore}" id = "hidden">
                        ${insideViewBox}
                        ${distortionsList}
                    </div>
                `
            })
            lastVisible = data.docs[data.docs.length-1];
            entriesCollectionRef.innerHTML += viewBox;
            if(data.docs.length === 0){
                loadMorePrompts.removeEventListener('scroll',handleScroll)
                return;
            }
        }
        getNextPrompts().then(()=>{
            journalHome.viewJournalBox()
        });

        let loadMorePrompts = document.querySelector(".entries-collection-container")

        const handleScroll = async () =>{
            let triggerHeight = loadMorePrompts.scrollTop + loadMorePrompts.offsetHeight;
            if(triggerHeight >= loadMorePrompts.scrollHeight){
                await getNextPrompts();
                journalHome.viewJournalBox()
            }
            return;
        }
        loadMorePrompts.addEventListener('scroll',handleScroll);
        
    },
    // Delete user written document
    deleteDoc: async (e)=>{
        let parentOfBtn = e.target.parentElement
        let targetParent = parentOfBtn.parentElement
        let title = targetParent.querySelector("#prompt-title-display").innerText
        let userId = journalHome.getUserId()
        await deleteDoc(doc(db, "users", userId,"userPromptsList",title));

        // Remove current Journal display
        let displayPromptBox = document.querySelector('.display-user-journal'); 
        displayPromptBox.classList.add("hidden")

        //Remove active entries section
        entriesModal.classList.remove("entries-active");
        homeScreenEntries.classList.remove("entries-active");
        let homeScreenText = document
            .querySelector(".home-text")
            .classList.remove("entries-active");
        journalBtn.classList.remove("unavailable");

        // Restart program to refresh current journals
        journalHome.getUserWrittenPrompts();
    },
    callObserver: async () =>{
        // Add journal section -------------- IntersectionObserver to highlight the selected prompt thats in view.
        let options = {
            root: null,
            rootMargin: "-46% -0px -52% -0px",
            threshold: 0.05
        }
        let observer = new IntersectionObserver(intersection, options)
        document.querySelectorAll('.java-script-li li').forEach(li =>{
            observer.observe(li)
        })
        function intersection(entries){
            entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.classList.add("active")
                localStorage.setItem("currentActivePrompt",entry.target.innerText)
            }else{
                entry.target.classList.remove("active")
            }
            })
        }
        // Let's user select a prompt if they decide to click on a prompt they choose.
        let promptList = document.querySelectorAll(".java-script-li li");
        promptList.forEach(item =>{
            item.addEventListener("click",(prompt)=>{
            promptList.forEach(prompt=>{
                prompt.classList.remove("active")
            })
            prompt.target.classList.add("active")
            localStorage.setItem("currentActivePrompt",prompt.target.textContent)
            })
        })
    },
    loadPrompts: async() =>{
        const userId =  journalHome.getUserId()
        const update = onSnapshot(doc(db,"users", userId), (doc) =>{
            initScript();
        })
        const initScript = async () =>{
            document.querySelector('.java-script-li').innerHTML = ""
            let lastVisible = null;

            const getList = async () =>{
                const initial = query(collection(db, "users",journalHome.getUserId(),"userPromptsList"), orderBy("status"), startAfter(lastVisible), limit(50));
                const data = await getDocs(initial);
                let listParent = document.querySelector('.java-script-li')
                let template = '';
                data.docs.forEach(doc =>{
                    template += `
                        <li class = "li-item ${getFilterName(doc.data().tag)}">${doc.id}</li>
                    `
                })

                lastVisible = data.docs[data.docs.length-1];
                if(data.docs.length === 0){
                    if(data.docs.length === 0 & document.querySelector(".java-script-li").childElementCount === 0){
                        localStorage.setItem("currentActivePrompt","You ran out of prompts!")
                        let emptyList = '';
                        emptyList += `<li class = "li-item">You ran out of prompts!</li>`
                        listParent.innerHTML += emptyList;
                        return;
                    }
                    loadMorePrompts.removeEventListener('scroll',handleScroll)
                    return;
                }
                listParent.innerHTML += template;
            }
            function getFilterName(name){
                switch(name){
                    case "Thought Provoking":
                        return "thought-provoking"
                    case "Feel Good":
                        return "feel-good";
                    case "Gratitude":
                        return "gratitude"
                }
            }
            let loadMorePrompts = document.querySelector(".prompt-selector")
            await getList()
            journalHome.callObserver();



            async function handleScroll(){
                let triggerHeight = loadMorePrompts.scrollTop + loadMorePrompts.offsetHeight;
                if(triggerHeight >= loadMorePrompts.scrollHeight){
                    await getList();
                    journalHome.callObserver();
                }
                return;
            }
            loadMorePrompts.addEventListener('scroll',handleScroll);
            journalHome.callObserver();

            let filterBox = document.querySelectorAll(".filter-box");
            let filters = [];
            filterBox.forEach(filter =>{
                filter.onclick = () =>{
                    filters = [];
                    if(filter.classList.contains("disabled")){
                        filter.classList.remove("disabled")
                        filterBox.forEach(filter =>{
                            if(!filter.classList.contains("disabled")){
                                filters.push(filter.innerHTML);
                            }
                        })
                        displayFilters();
                        return
                    }
                    filters = [];
                    filter.classList.add("disabled")
                    filterBox.forEach(filter =>{
                        if(!filter.classList.contains("disabled")){
                            filters.push(filter.innerHTML);
                        }
                    })

                    let prompts = document.querySelectorAll(".li-item")
                    if(filters.length === 0){
                        prompts.forEach(prompt =>{
                            prompt.style.display = ""
                        })
                        return;
                    }
                    displayFilters();
                    function displayFilters(){
                        let prompts = document.querySelectorAll(".li-item")
                        prompts.forEach(prompt =>{
                            prompt.style.display = "none"
                        })
                        filters.forEach(filter =>{
                            let filterName = getFilterName(filter);
                            prompts.forEach(prompt =>{
                                if(prompt.classList.contains(filterName)){
                                    switch(filterName){
                                        case ("gratitude"):
                                            prompt.style.color = "rgb(202, 136, 14)"
                                            prompt.style.display = "";
                                            return;
                                        case ("feel-good"):
                                            prompt.style.color = "rgb(76, 156, 76)"
                                            prompt.style.display = "";
                                            return;
                                            case ("thought-provoking"):
                                            prompt.style.color = "rgb(95, 157, 199)"
                                            prompt.style.display = "";
                                            return;
                                    }
                                    prompt.style.display = "";
                                    return
                                }
                            })
                            
                        })
                    }
                }
            })
        }
    },
    viewJournalBox: async () =>{
        let count;
        const deleteButtonStyling = () =>{
            let deleteBtn = document.querySelector("#deleteJournal")
            deleteBtn.classList.remove("confirmation")
            deleteBtn.innerText = "Delete Entry"
            count = 0;
        }
        // Adding user functionality if they wish to view their journals
        let userViewJournal = document.querySelectorAll(".viewBox");
        // For each allows us to specify what is to be presented on screen. 
        userViewJournal.forEach((box)=>{
            box.onclick = (journal)=>{
                let currentMoodTitle = document.querySelector("#current-mood-title")
                let currentMoodContainer = document.querySelector("#current-mood-container")
                let afterMoodTitle = document.querySelector("#after-mood-title")
                let afterMoodContainer = document.querySelector("#after-mood-container");

                if(journal.target.classList.contains("cbt-disabled")){
                    currentMoodTitle.classList.add("hide-item")
                    currentMoodContainer.classList.add("hide-item")
                    afterMoodTitle.classList.add("hide-item")
                    afterMoodContainer.classList.add("hide-item")
                }else{
                    currentMoodTitle.classList.remove("hide-item")
                    currentMoodContainer.classList.remove("hide-item")
                    afterMoodTitle.classList.remove("hide-item")
                    afterMoodContainer.classList.remove("hide-item")
                }
                deleteButtonStyling();
                // Referencing target titles to get values
                let targetTitle = journal.target.querySelector(".user-prompt-title")
                let targetAnswer = journal.target.querySelector(".user-prompt-answer");
                let targetEmotion = journal.target.querySelector(".emotion-display")
                let targetEmotionResponse = journal.target.querySelector(".emotion-response-display")
                let targetEmotionAfter = journal.target.querySelector(".mood-after-display")

                let title = targetTitle.innerText;
                let answer = targetAnswer.innerText;
                let emotionName = targetEmotion.innerText;
                let emotionResponse = targetEmotionResponse.innerText;
                let emotionAfterResponse = targetEmotionAfter.innerText;

                // Removing class hidden from displayprompt box
                let displayPromptBox = document.querySelector('.display-user-journal'); 
                displayPromptBox.classList.remove("hidden")
                // Changing title display to given title display this goes for responseDisplay aswell
                let titleDisplay = document.querySelector("h1#prompt-title-display").textContent = title
                let responseDisplay = document.querySelector("#prompt-answer-display").innerText = answer;
                let emotionDisplay = document.querySelector("#modal-current-emotion").innerText = emotionName;
                let emotionResponseDisplay = document.querySelector("#modal-current-emotion-response").innerText = emotionResponse;
                let emotionAfterResponseDisplay = document.querySelector("#modal-after-emotion").innerText = emotionAfterResponse
            }
            let delay;
            box.addEventListener("mouseover",(box)=>{
                delay = setTimeout(()=>{
                    box.target.classList.add("box-hover-zoom")
                },1000)
            })
            box.addEventListener("mouseleave",(box)=>{
                clearTimeout(delay);
                box.target.classList.remove("box-hover-zoom")
            })
        })
        let deleteBtn = document.querySelector("#deleteJournal")
        deleteBtn.onclick = async function(e){
            count +=1;
            if(count === 1){
                deleteBtn.classList.add("confirmation")
                deleteBtn.innerText = "Are you sure?"
                return;
            }
            deleteButtonStyling();
            journalHome.deleteDoc(e);
        }
    },
    resetHome: () =>{
        // SETTING VARIABLES {ONCE SUBMIT IS CLICKED: RETURN TO HOME PAGE / REMOVE JOURNAL WRITING SECTION}
        let journalModal = document.querySelector(".write-journal");
        let homeScreen = document.querySelector(".home-journal-entries-options");
        let newMoodPage = document.querySelector(".user-after-feeling");
        let header = document.querySelector("header");
        let currentMoodActive = document.querySelector(".get-current-mood-section")
        let userResponsePage = document.querySelector(".user-response-to-prompt");

        // Remove currentmood page
        
        // >>>>FUNCTIONALITY: RESETTING TO SUIT HOME 
        currentMoodActive.classList.remove("active");
        userResponsePage.classList.remove("active")
        newMoodPage.classList.remove("active")
        journalModal.classList.remove("active");
        homeScreen.classList.remove("journal-active");
        let homeScreenText = document.querySelector(".home-text").classList.remove("journal-active");
        journalModal.classList.remove("journal-active");
        entriesBtn.classList.remove("unavailable");
        header.classList.remove("header-hide")

        // Remove any active classes in current mood.
        document.querySelectorAll(".emotion-container").forEach(mood =>{
            document.querySelectorAll(".emotion-container").forEach(container =>{
                container.classList.remove("active")
            })
        })

        // Remove previous responses.
        let userJournalResponse = document.querySelector("#textarea").value = "" //remove input from journal entry textarea
        let currentMoodResponse = document.querySelector(".current-mood-answer").value = ""
        let newMoodResponse = document.querySelector(".new-mood-response-textarea").value = ""
        document.querySelectorAll(".emotion-container").forEach(container =>{
            container.classList.remove("active")
        })

        let distortionOpts = document.querySelectorAll(".distortion-option")
        distortionOpts.forEach(opt =>{
            opt.classList.remove("active")
        })

        document.querySelector(".char-limit-bar-overlay").style.width = "0px"
        document.querySelector(".char-limit-bar-overlay-journal").style.width = "0px"
        document.querySelector(".char-limit-bar-overlay-moodafter").style.width = "0px"


        let filterBox = document.querySelectorAll(".filter-box");
        filterBox.forEach(filter =>{
            filter.classList.add("disabled");
        });

    },
    resetPrompts: () =>{
        let resetPrompts = document.querySelector(".delete-prompts-btn");
        resetPrompts.onclick = async () =>{
            prompts.forEach(async (prompt)=>{
                let setPrompts = prompt.prompt;
                let tags = prompt.tags
                await setDoc(doc(db, "users", journalHome.getUserId(), "userPromptsList",setPrompts),{
                    status: "incomplete",
                    tag: tags
                })
            })
            let interval = setTimeout(()=>{
                window.location.reload();
            },3000) 
        }
    }
    
}

const journalSignIn = {
    init: () => {
        if(localStorage.getItem("darkMode?") === "true"){
            document.body.classList.remove("theme-default")
            document.body.classList.add("theme-dark")
         }else{
             document.body.classList.remove("theme-dark")
             document.body.classList.add("theme-default")
         }
        document.addEventListener("DOMContentLoaded",journalSignIn.pageScript())
    },
    pageScript: () => {

    let resetBtn = document.querySelector(".reset-btn")
      resetBtn.onclick = () =>{
        let email = document.querySelector(".email-input").value
        let confirmationModal = document.querySelector(".forgot-password-confirmation")
        let resetModal = document.querySelector(".forgot-password-section")
        if(validateEmail(email)){
            sendPasswordResetEmail(auth, email)
              .then(() => {
                resetModal.classList.remove("active")
                confirmationModal.classList.add("active")
              })
              .catch((error) => {
                let email = document.querySelector(".email-input").setAttribute("data-error","Please enter a valid email address.")
                // ..
              });
          return;
        }

      }
      function validateEmail(username){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(username)){
            let email = document.querySelector(".email-input").removeAttribute("data-error")
            return (true)
        }
            let email = document.querySelector(".email-input").setAttribute("data-error","Please enter a valid email address.")
            return (false);
      }

        // adding functionality to sign in form
        let loginInputForm = document.querySelector("#sign-up-form")
        loginInputForm.addEventListener("submit",(form)=>{
            form.preventDefault();
            const auth = getAuth();
            let email = loginInputForm.username.value
            let password = loginInputForm.password.value
            if(email === "" || password === ""){
                return;
            }
            
            signInWithEmailAndPassword(auth,email,password).then(() => {
                window.location.href = "/journal/journalHome.html"
            })
            .catch((error) =>{
                const errorCode = error.code
                let emailError = document.querySelector("#input-container-username")
                let passError = document.querySelector("#input-container-password")
                emailError.removeAttribute('data-error')
                passError.removeAttribute('data-error')
                switch(errorCode){
                    case "auth/internal-error":
                        emailError.setAttribute("data-error","Internal Error!")
                        break;
                    case "auth/invalid-email":
                        emailError.setAttribute("data-error","Please enter a valid email address!");
                        break;
                    case "auth/wrong-password":
                        passError.setAttribute("data-error","Incorrect password, try again.");
                        break;
                    case "auth/user-not-found":
                        emailError.setAttribute("data-error","User is not found.");
                        break;
                    case "auth/too-many-requests":
                        emailError.setAttribute("data-error","You're sending too many requests, try again in a couple minutes!");
                        break;
                }
            })
        })

        let signInGoogle = document.querySelector(".google-signIn")
        signInGoogle.onclick = (e) =>{
            e.preventDefault();
            signInWithPopup(auth, provider)
                .then(async (result)=>{
                    const docRef = doc(db,"users",result.user.uid)
                    const docSnap = await getDoc(docRef);
                    if(!docSnap.exists()){
                        const userUid = result.user.uid;
                        await setDoc(doc(db,"users", userUid),{
                            name: result.user.displayName,
                            email: result.user.email
                        })
                        await journalApp.loadUserPrompts(userUid);
                        window.location.href = "/journal/userWelcome.html"
                        return;
                    }
                    window.location.href = "/journal/journalHome.html"
                    }).catch((error) =>{
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    const email = error.email;
                    const credential = GoogleAuthProvider.credentialFromError(error);
                })
        }
        
    }
}

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}






