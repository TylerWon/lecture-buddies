import { IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// DefaultAcceptButton component
export function DefaultAcceptButton(props) {
    return (
        <IconButton color="secondary" size="small" {...props}>
            <CheckCircleIcon />
        </IconButton>
    );
}

// DefaultAddButton component
export function DefaultAddButton(props) {
    return (
        <IconButton color="primary" size="small" {...props}>
            <AddCircleIcon />
        </IconButton>
    );
}

// DefaultCancelButton component
export function DefaultCancelButton(props) {
    return (
        <IconButton color="grey" size="small" {...props}>
            <CancelIcon />
        </IconButton>
    );
}
