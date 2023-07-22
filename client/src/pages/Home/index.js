import { useState } from "react";

import Login from "./Login";
import SignUp from "./SignUp";

// Home component
function Home() {
    // Hooks
    const [showSignUp, setShowSignUp] = useState(false);

    return (
        <>
            <Login setShowSignUp={setShowSignUp} />
            <SignUp showSignUp={showSignUp} setShowSignUp={setShowSignUp} />
        </>
    );
}

export default Home;
