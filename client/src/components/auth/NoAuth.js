import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

import { UserContext } from "../../contexts/UserContext";

function NoAuth() {
    const { isLoggedIn } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/courses");
        }
    }, [isLoggedIn]);

    return <>{isLoggedIn ? null : <Outlet />}</>;
}

export default NoAuth;
