import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";

// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const YEARS = [
    { id: "1st", year_name: "1st" },
    { id: "2nd", year_name: "2nd" },
    { id: "3rd", year_name: "3rd" },
    { id: "4th", year_name: "4th" },
    { id: "5th", year_name: "5th" },
    { id: "5th+", year_name: "5th+" },
];

// Yup validation schema for form
const validationSchema = yup.object({
    school: yup.string().required("School is required"),
    year: yup.string().required("Year is required"),
    faculty: yup.string().required("Faculty is required"),
    major: yup.string().required("Major is required"),
});

// CustomTextField component
function CustomTextField(props) {
    const { id, label, formik } = props;

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
        />
    );
}

// CustomSelectField component
function CustomSelectField(props) {
    const { id, label, formik, options } = props;

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
            >
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                        {option[`${id}_name`]}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText error={formik.touched[id] && Boolean(formik.errors[id])}>
                {formik.touched[id] && formik.errors[id]}
            </FormHelperText>
        </FormControl>
    );
}

// SignUpStep3 component
function SignUpStep2(props) {
    // Props
    const { setActiveStep } = props;

    // Hooks
    const formik = useFormik({
        initialValues: {
            school: "",
            year: "",
            faculty: "",
            major: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleEducationFormSubmit(values);
        },
    });
    const [schools, setSchools] = useState([]);

    // TODO
    // Handler for when form is submitted
    const handleEducationFormSubmit = async (values) => {
        // Get student
        // Update student
    };

    // TODO
    // Gets schools
    const getSchools = async () => {};

    // Gets schools on initial load
    useEffect(() => {
        getSchools();
    }, []);

    return (
        <FormControl component="form" fullWidth onSubmit={formik.handleSubmit}>
            <Stack direction="column" alignItems="center" spacing={2}>
                <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                        <CustomSelectField id="school" label="School" formik={formik} options={schools} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <CustomSelectField id="year" label="Year" formik={formik} options={YEARS} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <CustomTextField id="faculty" label="Faculty" formik={formik} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <CustomTextField id="major" label="Major" formik={formik} />
                    </Grid>
                </Grid>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Next
                </Button>
            </Stack>
        </FormControl>
    );
}

export default SignUpStep2;
