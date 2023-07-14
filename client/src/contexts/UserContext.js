import { createContext, useState } from "react";

// UserContext
export const UserContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    userId: null,
    setUserId: () => {},
});

// UserContextProvider component
export function UserContextProvider(props) {
    // Hooks
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
            {props.children}
        </UserContext.Provider>
    );
}
