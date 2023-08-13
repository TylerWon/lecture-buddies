import { useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import DesktopNavbar from "./components/DesktopNavbar";
import TabletNavbar from "./components/TabletNavbar";

// Navbar component
export default function Navbar() {
    // Hooks
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            {isTablet ? <TabletNavbar /> : <DesktopNavbar />}
            <Outlet />
        </>
    );
}
