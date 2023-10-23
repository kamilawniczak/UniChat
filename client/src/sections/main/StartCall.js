import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import React from "react";

import CallElement from "../../components/CallElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { MEMBER_LIST } from "../../data";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StartCall = ({ open, handleClose }) => {
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        sx={{ p: 4 }}
      >
        <DialogTitle>Start Call</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={3}>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search..." />
              </Search>
            </Stack>
            {/* {call list} */}
            <Stack spacing={2}>
              {MEMBER_LIST.map((e) => (
                <CallElement {...e} key={e.id} />
              ))}
            </Stack>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent="end"
            >
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Create
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StartCall;
