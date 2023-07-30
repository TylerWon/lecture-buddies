import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

import { getSchools } from "../../../../../../../../utils/requests";

import { DefaultSelectField, DefaultTextArea, DefaultTextField } from "../../../../../../../../components/atoms/input";

// Constants
const YEARS = [
    { year_id: "1st", year_name: "1st" },
    { year_id: "2nd", year_name: "2nd" },
    { year_id: "3rd", year_name: "3rd" },
    { year_id: "4th", year_name: "4th" },
    { year_id: "5th", year_name: "5th" },
    { year_id: "5th+", year_name: "5th+" },
];

// TextInputs component
export default function TextInputs(props) {
    // Props
    const { formik } = props;

    // Hooks
    const [schools, setSchools] = useState([]);

    // Initializes values
    const init = async () => {
        try {
            // Get schools
            const getSchoolsResponse = await getSchools();
            const getSchoolsData = await getSchoolsResponse.json();

            // Set schools state
            setSchools(getSchoolsData);
        } catch (err) {
            console.log(err); // unexpected server error
        }
    };

    // Initializes values
    useEffect(() => {
        init();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="firstName" label="First name" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="lastName" label="Last name" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultSelectField id="school" label="School" formik={formik} options={schools} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultSelectField id="year" label="Year" formik={formik} options={YEARS} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="faculty" label="Faculty" formik={formik} />
            </Grid>
            <Grid xs={12} sm={6}>
                <DefaultTextField id="major" label="Major" formik={formik} />
            </Grid>
            <Grid xs={12}>
                <DefaultTextArea id="bio" label="Bio" formik={formik} />
            </Grid>
        </Grid>
    );
}
