import { createContext, useState } from "react";

// UserContext
export const UserContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    studentId: null,
    setStudentId: () => {},
});

// UserContextProvider component
export function UserContextProvider(props) {
    // Hooks
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [studentId, setStudentId] = useState(null);

    return (
        <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, studentId, setStudentId }}>
            {props.children}
        </UserContext.Provider>
    );
}
