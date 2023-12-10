import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";

import RemoveUserForm from "./RemoveUserForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RemoveUser = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      <DialogTitle>Remove user</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <RemoveUserForm handleClose={handleClose} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveUser;
