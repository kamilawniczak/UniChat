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
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteDirectConversation,
  DeleteGroupConversation,
  getRoomId,
} from "../redux/slices/conversation";
import { OpenSnackBar, ResetRoom, getChatType } from "../redux/slices/app";
import { getUserId } from "../redux/slices/auth";
import { socket } from "../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteDialog = ({ open, handleClose }) => {
  const room_id = useSelector(getRoomId());
  const chat_type = useSelector(getChatType());
  const user_id = useSelector(getUserId());
  const dispatch = useDispatch();

  const isGroupChat = chat_type === "OneToMany";

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this chat
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancle</Button>
        <Button
          onClick={() => {
            handleClose();
            if (!isGroupChat) {
              socket.emit(
                "deleteConversation",
                { room_id, user_id },
                async (data) => {
                  if (!isGroupChat) {
                    dispatch(
                      OpenSnackBar({
                        severity: "success",
                        message: data.message,
                      })
                    );

                    dispatch(
                      DeleteDirectConversation({ room_id: data.room_id })
                    );

                    dispatch(ResetRoom());
                  }
                }
              );
            } else {
              socket.emit(
                "deleteGroupConversation",
                { room_id, user_id },
                async (data) => {
                  if (isGroupChat) {
                    dispatch(
                      OpenSnackBar({
                        severity: "success",
                        message: data.message,
                      })
                    );
                    dispatch(
                      DeleteGroupConversation({ room_id: data.room_id })
                    );

                    dispatch(ResetRoom());
                  }
                }
              );
            }
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
