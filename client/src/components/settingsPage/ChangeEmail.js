import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";

import ChangeEmailForm from "./ChangeEmailForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ChangeEmail = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      <DialogTitle>Change your email</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <ChangeEmailForm handleClose={handleClose} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmail;
