import { createContext, useState } from "react";

// StudentContext
export const StudentContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    student: null,
    setStudent: () => {},
});

// StudentContextProvider component
export function StudentContextProvider(props) {
    // Hooks
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [student, setStudent] = useState(null);

    return (
        <StudentContext.Provider value={{ isLoggedIn, setIsLoggedIn, student, setStudent }}>
            {props.children}
        </StudentContext.Provider>
    );
}
