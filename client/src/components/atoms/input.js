import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";

// DefaultSelectField component
export function DefaultSelectField(props) {
    const { id, label, options, optionValueField, optionTextField, formik, ...selectProps } = props;

    return (
        <FormControl fullWidth>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
                fullWidth
                id={id}
                name={id}
                labelId={`${id}-label`}
                label={label}
                value={formik.values[id]}
                onChange={formik.handleChange}
                error={formik.touched[id] && Boolean(formik.errors[id])}
                {...selectProps}
            >
                {options.map((option, index) => (
                    <MenuItem key={index} value={option[optionValueField]} disabled={option["disabled"]}>
                        {option[optionTextField]}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText
                sx={formik.touched[id] && Boolean(formik.errors[id]) ? { display: "block" } : { display: "none" }}
                error={formik.touched[id] && Boolean(formik.errors[id])}
            >
                {formik.touched[id] && formik.errors[id]}
            </FormHelperText>
        </FormControl>
    );
}

// DefaultTextArea component
export function DefaultTextArea(props) {
    const { id, label, formik } = props;

    return (
        <TextField
            fullWidth
            multiline
            minRows={5}
            id={id}
            name={id}
            label={label}
            value={formik.values[id]}
            onChange={formik.handleChange}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
        />
    );
}

// DefaultTextField component
export function DefaultTextField(props) {
    const { id, label, formik, ...textFieldProps } = props;

    return (
        <TextField
            fullWidth
            id={id}
            name={id}
            label={label}
            value={formik.values[id]}
            onChange={formik.handleChange}
            error={formik.touched[id] && Boolean(formik.errors[id])}
            helperText={formik.touched[id] && formik.errors[id]}
            {...textFieldProps}
        />
    );
}
