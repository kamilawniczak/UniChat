import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";

import CreateGroupForm from "./CreateGroupForm";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      <DialogTitle>Create New Group</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <CreateGroupForm handleClose={handleClose} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
