import { Stack, Typography } from "@mui/material";
import React from "react";

import AuthSocial from "../../sections/auth/AuthSocial";
import LoginForm from "../../sections/auth/LoginForm";

const Login = () => {
  return (
    <Stack spacing={1} sx={{ mt: 2, mb: 5, position: "relative" }}>
      <Typography variant="h4">Login to your account</Typography>
      <LoginForm />
      <AuthSocial />
    </Stack>
  );
};

export default Login;
