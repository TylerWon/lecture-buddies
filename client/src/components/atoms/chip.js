import { Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// DefaultChip component
export function DefaultChip(props) {
    const { ...chipProps } = props;

    return <Chip variant="outlined" {...chipProps} />;
}

// ChipWithDelete component
export function ChipWithDelete(props) {
    const { ...interestChipProps } = props;

    return <DefaultChip deleteIcon={<CloseIcon />} {...interestChipProps} />;
}
