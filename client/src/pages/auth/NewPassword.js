import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "@phosphor-icons/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import NewPasswordForm from "../../sections/auth/NewPasswordForm";

const NewPassword = () => {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
          Reset Password
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Please set your new password
        </Typography>
      </Stack>
      <NewPasswordForm />

      <Link
        component={RouterLink}
        to="/auth/login"
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: "center",
          display: "inline-flex",
        }}
      >
        <CaretLeft />
        Return to sign in
      </Link>
    </>
  );
};

export default NewPassword;
