import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import Auth from "./components/auth/Auth";
import AutoLogin from "./components/auth/AutoLogin";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import NoAuth from "./components/auth/NoAuth";

// React Router setup
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AutoLogin />}>
            <Route element={<NoAuth />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Auth />}>
                <Route path="/courses" element={<Courses />} />
            </Route>
        </Route>
    )
);

// App component
export default function App() {
    return <RouterProvider router={router} />;
}
