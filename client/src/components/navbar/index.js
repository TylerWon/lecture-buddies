import { useMediaQuery, useTheme } from "@mui/material";

import DesktopNavbar from "./components/DesktopNavbar";
import MobileNavbar from "./components/MobileNavbar";

// Navbar component
export default function Navbar() {
    // Hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return <>{isMobile ? <MobileNavbar /> : <DesktopNavbar />}</>;
}
