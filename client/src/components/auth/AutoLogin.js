import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import { autoLogin } from "../../utils/apiRequests";
import { StudentContext } from "../../contexts/StudentContext";

// AutoLogin component
export default function AutoLogin() {
    // Hooks
    const { setIsLoggedIn, setStudent } = useContext(StudentContext);
    const [isLoading, setIsLoading] = useState(true);

    // Logs a user in if they have a valid session cookie
    const login = async () => {
        try {
            // Try to log user in
            const autoLoginResponse = await autoLogin();
            const autoLoginData = await autoLoginResponse.json();
            if (autoLoginResponse.status === 200) {
                setIsLoggedIn(true);
                setStudent(autoLoginData);
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
