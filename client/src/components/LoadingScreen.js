import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
  return (
    <>
      <Box
        display="flex"
        flexGrow={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={50} color="primary" />
        <Typography variant="body1" mt={2}>
          Loading...
        </Typography>
      </Box>
    </>
  );
};

export default LoadingScreen;
