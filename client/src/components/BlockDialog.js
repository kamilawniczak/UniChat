import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import React from "react";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../redux/slices/auth";
import { OpenSnackBar, getChatType } from "../redux/slices/app";
import {
  UpdateDirectConversation,
  UpdateGroupConversation,
  getRoomId,
} from "../redux/slices/conversation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  const room_id = useSelector(getRoomId());
  const chat_type = useSelector(getChatType());
  const user_id = useSelector(getUserId());
  const dispatch = useDispatch();
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Block this content</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this conversation
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancle</Button>
        <Button
          onClick={() => {
            handleClose();
            socket.emit(
              "block",
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
                      conversation: { room_id, type: "block" },
                    })
                  );
                }
                if (chat_type === "OneToMany") {
                  dispatch(
                    UpdateGroupConversation({
                      conversation: { room_id, type: "block" },
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

export default BlockDialog;
