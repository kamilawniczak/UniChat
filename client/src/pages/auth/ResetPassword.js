import { Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { CaretLeft } from "@phosphor-icons/react";
import ResetPasswordForm from "../../sections/auth/resetPasswordForm";
import { useSelector } from "react-redux";
import { getIsLoadingAuth } from "../../redux/slices/auth";

const ResetPassword = () => {
  const isLoading = useSelector(getIsLoadingAuth());
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
          Forgot Password
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Please provide the email address associated with your account, and we
          will send you a link to reset your password.
        </Typography>
        <ResetPasswordForm />
        <Link
          component={RouterLink}
          to="/auth/login"
          color="inherit"
          variant="subtitle2"
          sx={{
            alignItems: "center",
            display: "inline-flex",
            pointerEvents: isLoading ? "none" : "auto",
          }}
        >
          <CaretLeft />
          Return to sign in
        </Link>
      </Stack>
    </>
  );
};

export default ResetPassword;
