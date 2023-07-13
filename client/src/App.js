import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import NoAuth from "./components/NoAuth";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<NoAuth />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route path="/courses" element={<Courses />} />
        </>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
