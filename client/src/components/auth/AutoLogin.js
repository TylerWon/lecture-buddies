import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { autoLogin } from "../../utils/apiRequests";
import { UserContext } from "../../contexts/UserContext";

// AutoLogin component
export default function AutoLogin() {
    // Hooks
    const { setIsLoggedIn, setStudentId } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);

    // Logs a user in if they have a valid session cookie
    const login = async () => {
        try {
            // Try to log user in
            const autoLoginResponse = await autoLogin();
            const autoLoginData = await autoLoginResponse.json();

            // If login is succesful, set user context
            if (autoLoginResponse.status === 200) {
                setIsLoggedIn(true);
                setStudentId(autoLoginData.userId);
            }

            // Set loading to false
            setIsLoading(false);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Tries to log a user in
    useEffect(() => {
        login();
    }, []);

    return <>{isLoading ? null : <Outlet />}</>;
}
