import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import Auth from "./components/Auth";
import Courses from "./pages/Courses";
import Home from "./pages/Home";
import NoAuth from "./components/NoAuth";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<NoAuth />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<Auth />}>
                <Route path="/courses" element={<Courses />} />
            </Route>
        </>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
