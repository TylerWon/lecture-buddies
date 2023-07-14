import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { UserContext } from "../../contexts/UserContext";

// Auth component
function Auth() {
    // Hooks
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    // Checks if user is logged in. If not, redirects to /
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    return <>{isLoggedIn ? <Outlet /> : null}</>;
}

export default Auth;
