import { Link, Stack, Typography } from "@mui/material";
import React from "react";

import { CaretLeft } from "@phosphor-icons/react";
import { Link as RouterLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { getIsLoadingAuth } from "../../redux/slices/auth";
import VerifyForm from "../../components/auth/VerifyForm";

const Verify = () => {
  const isLoading = useSelector(getIsLoadingAuth());
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraph>
          Please verify OTP
        </Typography>

        <Stack direction="row">
          <Typography variant="body2">
            Sent to email (emaple@gmail.com)
          </Typography>
        </Stack>
      </Stack>
      <VerifyForm />

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
    </>
  );
};

export default Verify;
