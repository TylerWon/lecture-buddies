import { createContext, useState } from "react";

export const UserContext = createContext({
    loggedIn: false,
    setLoggedIn: () => {},
    userId: null,
    setUserId: () => {},
});

export function UserContextProvider(props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ loggedIn, setLoggedIn, userId, setUserId }}>
            {props.children}
        </UserContext.Provider>
    );
}
