import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { StudentContext } from "../../contexts/StudentContext";

// Auth component
export default function Auth() {
    // Hooks
    const { isLoggedIn } = useContext(StudentContext);
    const navigate = useNavigate();

    // Checks if user is logged in. If not, redirects to /
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn]);

    return <>{isLoggedIn ? <Outlet /> : null}</>;
}
