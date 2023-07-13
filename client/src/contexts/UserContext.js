import { createContext, useState } from "react";

export const UserContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    userId: null,
    setUserId: () => {},
});

export function UserContextProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
            {props.children}
        </UserContext.Provider>
    );
}
