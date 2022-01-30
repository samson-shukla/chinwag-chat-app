import './App.css';

import firebase from 'firebase/compat/app'; //firebase SDK - firebase v9 import
import 'firebase/compat/auth';  //firestore for database - firebase v9 import
import 'firebase/compat/firestore'; //for user authentication - firebase v9 import

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  // API Keys
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);  //useAuthState hook to track login info of a user

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

  function ChatRoom(){
    return "Welcome to the ChatRoom"
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chinwag Chat App</h1>
      </header>

      <section className="chat-room">
        {user ? <ChatRoom/> : <SignIn />}
      </section>
    </div>
  );
}

export default App;
