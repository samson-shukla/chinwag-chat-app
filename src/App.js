import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; //firebase SDK - firebase v9 import
import 'firebase/compat/auth';  //firestore for database - firebase v9 import
import 'firebase/compat/firestore'; //for user authentication - firebase v9 import

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ss-reactjs.firebaseapp.com",
  projectId: "ss-reactjs",
  storageBucket: "ss-reactjs.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: "G-FC6WXH60RS"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);  //useAuthState hook to track login info of a user

  return (
    <div className="App">
      <header>
        <h1>Chinwag Chat 🔥</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );

  function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
    );
  }

  function SignOut(){
    return auth.currentUser && (
      <button onClick={() => auth.signOut()}>Sign Out</button>
    );
  }

  function ChatRoom() {
    const scrollDown = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(20);
  
    const [messages] = useCollectionData(query, { idField: 'id' });  
    const [formValue, setFormValue] = useState('');  
  
    const sendMessage = async (e) => {
      e.preventDefault();  
      const { uid, photoURL } = auth.currentUser;
  
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      })
  
      setFormValue('');
      scrollDown.current.scrollIntoView({ behavior: 'smooth' });
    }
  
    return (<>
      <main>  
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}  
        <span ref={scrollDown}></span>  
      </main>  
      <form onSubmit={sendMessage}>  
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="type here" />  
        <button type="submit" disabled={!formValue}>✈️</button>  
      </form>
    </>)
  }

  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="dP" />
        <p>{text}</p>
      </div>
    </>)
  }

}

export default App;
