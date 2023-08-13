import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import Auth from "./components/auth/Auth";
import AutoLogin from "./components/auth/AutoLogin";
import Buddies from "./pages/Buddies";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Navbar from "./components/Navbar";
import NoAuth from "./components/auth/NoAuth";
import Profile from "./pages/Profile";

// React Router setup
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AutoLogin />}>
            <Route element={<NoAuth />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Auth />}>
                <Route element={<Navbar />}>
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/buddies" element={<Buddies />} />
                    <Route path="/messages" element={<Messages />} />
                </Route>
            </Route>
        </Route>
    )
);

// App component
export default function App() {
    return <RouterProvider router={router} />;
}
