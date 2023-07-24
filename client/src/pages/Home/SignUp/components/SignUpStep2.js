import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import { useFormik } from "formik";
import { useContext } from "react";
import { useEffect, useState } from "react";
import * as yup from "yup";

import { UserContext } from "../../../../contexts/UserContext";
import { getSchools, updateStudent } from "../../../../utils/requests";

// Constants
const YEARS = [
    { year_id: "1st", year_name: "1st" },
    { year_id: "2nd", year_name: "2nd" },
    { year_id: "3rd", year_name: "3rd" },
    { year_id: "4th", year_name: "4th" },
    { year_id: "5th", year_name: "5th" },
    { year_id: "5th+", year_name: "5th+" },
];

// Yup validation schema for form
const validationSchema = yup.object({
    school: yup.number().required("School is required"),
    year: yup.string().required("Year is required"),
    faculty: yup.string().required("Faculty is required"),
    major: yup.string().required("Major is required"),
});

// Container for the content
const ContentContainer = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing(2),
}));

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
                    <MenuItem key={option[`${id}_id`]} value={option[`${id}_id`]}>
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
    const { userId } = useContext(UserContext);
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

    // Handler for when form is submitted
    const handleEducationFormSubmit = async (values) => {
        try {
            // Update student
            const updateStudentResponse = await updateStudent(userId, values);
            const updateStudentData = await updateStudentResponse.json();
            if (updateStudentResponse.status === 400) {
                throw new Error(updateStudentData.message);
            }

            // Move to next step in the sign up process
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    // Initializes values
    const init = async () => {
        try {
            // Get schools
            const getSchoolsResponse = await getSchools();
            const schools = await getSchoolsResponse.json();

            // Set schools state
            setSchools(schools);
        } catch (err) {
            console.log(err); // unexpected error
        }
    };

    // useEffect for initializing values
    useEffect(() => {
        init();
    }, []);

    return (
        <FormControl fullWidth component="form" onSubmit={formik.handleSubmit}>
            <ContentContainer>
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
            </ContentContainer>
        </FormControl>
    );
}

export default SignUpStep2;
