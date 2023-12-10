import { Stack, Typography } from "@mui/material";
import React from "react";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <Stack spacing={1} sx={{ mt: 2, mb: 5, position: "relative" }}>
      <Typography variant="h4">Login to your account</Typography>
      <LoginForm />
    </Stack>
  );
};

export default Login;
