import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { UserContext } from "../../contexts/UserContext";

// NoAuth component
function NoAuth() {
    // Hooks
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    // Checks if user is logged in. If so, redirects to /courses
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/courses");
        }
    }, [isLoggedIn]);

    return <>{isLoggedIn ? null : <Outlet />}</>;
}

export default NoAuth;
