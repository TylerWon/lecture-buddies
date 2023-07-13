import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";

import Home from "./pages/Home";
import Courses from "./pages/Courses";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
        </>
    )
);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
