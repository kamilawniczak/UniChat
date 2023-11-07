import { Link, Stack, Typography } from "@mui/material";

import React from "react";

import RegisterForm from "../../sections/auth/RegisterForm";

const Register = () => {
  return (
    <Stack spacing={1} sx={{ mt: 2, mb: 5, position: "relative" }}>
      <Typography variant="h4">Create your account</Typography>
      <RegisterForm />
      <Typography
        component="div"
        sx={{
          color: "text.secondary",
          mt: 3,
          typography: "caption",
        }}
        textAlign="start"
      >
        To be or not to be, that is the question. By clicking 'Sign Up,' I take
        the noble oath, binding myself to the{" "}
        <Link underline="always" color="text.primary">
          Terms of Service
        </Link>
        {" and "}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>{" "}
        thus venturing into the digital tempest with a merry heart
      </Typography>
    </Stack>
  );
};

export default Register;
