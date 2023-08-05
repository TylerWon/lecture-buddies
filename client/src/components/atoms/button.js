import { IconButton, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// AcceptButton component
export function AcceptButton(props) {
    return (
        <IconButton color="secondary" size="small" {...props}>
            <CheckCircleIcon />
        </IconButton>
    );
}

// AcceptAndCancelButtons component
export function AcceptAndCancelButtons(props) {
    const { acceptButtonProps, cancelButtonProps } = props;

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <AcceptButton {...acceptButtonProps} />
            <CancelButton {...cancelButtonProps} />
        </Stack>
    );
}

// AddButton component
export function AddButton(props) {
    const { onClick } = props;

    return (
        <IconButton color="primary" size="small" onClick={onClick}>
            <AddCircleIcon />
        </IconButton>
    );
}

// AddButtonWithLabel component
export function AddButtonWithLabel(props) {
    const { label, onClick } = props;

    return (
        <Stack direction="column" justifyContent="center" alignItems="center">
            <AddButton onClick={onClick} />
            <Typography variant="body1">{label}</Typography>
        </Stack>
    );
}

// CancelButton component
export function CancelButton(props) {
    const { onClick } = props;

    return (
        <IconButton color="grey" size="small" onClick={onClick}>
            <CancelIcon />
        </IconButton>
    );
}
