import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { StudentContext } from "../../contexts/StudentContext";

// NoAuth component
export default function NoAuth() {
    // Hooks
    const { isLoggedIn } = useContext(StudentContext);
    const navigate = useNavigate();

    // Checks if user is logged in. If so, redirects to /courses
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/courses");
        }
    }, [isLoggedIn]);

    return <>{isLoggedIn ? null : <Outlet />}</>;
}
