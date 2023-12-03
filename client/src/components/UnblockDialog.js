import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../redux/slices/auth";
import { OpenSnackBar } from "../redux/slices/app";
import {
  UpdateDirectConversation,
  UpdateGroupConversation,
} from "../redux/slices/conversation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const UnblockDialog = ({ open, handleClose, info }) => {
  let location = useLocation();
  const room_id = info.id;
  const chat_type = location.pathname === "/app" ? "OneToOne" : "OneToMany";
  const user_id = useSelector(getUserId());
  const dispatch = useDispatch();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      maxWidth="md"
    >
      <DialogTitle>Unblock this conversation</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to unblock{" "}
          <span style={{ fontSize: 18, fontWeight: 700 }}>{info.name}</span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancle</Button>
        <Button
          onClick={() => {
            handleClose();
            socket.emit(
              "unblock",
              {
                room_id,
                user_id,
                chat_type,
              },
              () => {
                dispatch(
                  OpenSnackBar({
                    severity: "success",
                    message: "Conversation blocked successfully",
                  })
                );
                if (chat_type === "OneToOne") {
                  dispatch(
                    UpdateDirectConversation({
                      conversation: { room_id, type: "unblock" },
                    })
                  );
                }
                if (chat_type === "OneToMany") {
                  dispatch(
                    UpdateGroupConversation({
                      conversation: { room_id, type: "unblock" },
                    })
                  );
                }
              }
            );
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnblockDialog;
