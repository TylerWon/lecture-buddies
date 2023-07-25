import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../contexts/UserContext";

// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// AutoLogin component
function AutoLogin() {
    // Hooks
    const { setIsLoggedIn, setUserId } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    // Logs a user in if they have a valid session cookie
    const autoLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/autologin`, {
                method: "POST",
                credentials: "include",
            });

            if (response.status === 200) {
                const data = await response.json();

                setIsLoggedIn(true);
                setUserId(data.userId);
            }

            setIsLoading(false);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Tries to automatically log a user in
    useEffect(() => {
        autoLogin();
    }, []);

    return <>{isLoading ? null : <Outlet />}</>;
}

export default AutoLogin;
