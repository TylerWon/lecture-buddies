import { createContext, useState } from "react";

// StudentContext
export const StudentContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    student: null,
    setStudent: () => {},
    resetContext: () => {},
});

// StudentContextProvider component
export function StudentContextProvider(props) {
    // Hooks
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [student, setStudent] = useState(null);

    // Resets context values
    const resetContext = () => {
        setIsLoggedIn(false);
        setStudent(null);
    };

    return (
        <StudentContext.Provider value={{ isLoggedIn, setIsLoggedIn, student, setStudent, resetContext }}>
            {props.children}
        </StudentContext.Provider>
    );
}
