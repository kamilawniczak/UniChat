import { Menu, MenuItem, Stack } from "@mui/material";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useState } from "react";
import { Message_options } from "../../data";
import {
  DeleteDirectMessage,
  DeleteGroupMessage,
  UpdateDirectMessage,
  UpdateGroupMessage,
  getDirectConversations,
  getGroupConversations,
} from "../../redux/slices/conversation";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import { getChatType } from "../../redux/slices/app";
import { getUserId } from "../../redux/slices/auth";
import { useReplayMsgContext } from "../../contexts/ReplyMsgContext";

function MessageOptions({
  msgId,
  type,
  incoming,
  openPicker,
  data: { message, file, isSaved },
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { onSetMsgId } = useReplayMsgContext();

  const {
    // current_meessages,
    current_conversation: current_direct_conversation,
  } = useSelector(getDirectConversations());
  const {
    // current_meessages,
    current_conversation: current_group_conversation,
  } = useSelector(getGroupConversations());
  const dispatch = useDispatch();
  const user_id = useSelector(getUserId());
  const chat_type = useSelector(getChatType());
  const open = Boolean(anchorEl);
  let current_conversation =
    chat_type === "OneToOne"
      ? current_direct_conversation
      : current_group_conversation;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMsgsOptions = (id) => {
    handleClose();
    switch (id) {
      case "save": {
        socket.emit(
          "saveMsg",
          { msgId, chat_type, room_id: current_conversation.room_id, user_id },
          () => {
            if (chat_type === "OneToOne") {
              dispatch(UpdateDirectMessage({ save: true, msgId }));
            }
            if (chat_type === "OneToMany") {
              dispatch(UpdateGroupMessage({ save: true, msgId }));
            }
          }
        );

        break;
      }

      case "replay": {
        onSetMsgId({ msgId, type: type || "text", text: message, file });
        break;
      }
      case "reactToMsg": {
        openPicker();

        break;
      }
      case "deleteMsg": {
        socket.emit(
          "deleteMsg",
          { msgId, chat_type, room_id: current_conversation.room_id, user_id },
          () => {
            if (chat_type === "OneToOne") {
              dispatch(DeleteDirectMessage({ id: msgId }));
            }
            if (chat_type === "OneToMany") {
              dispatch(DeleteGroupMessage({ id: msgId }));
            }
          }
        );
        break;
      }
      default:
        console.log("nie");
    }
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="menu-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="menu-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.filter((e) => !incoming || e.id !== "deleteMsg").map(
            (e) => {
              if (isSaved && e.id === "save")
                return (
                  <MenuItem onClick={() => handleMsgsOptions(e.id)} key={e.id}>
                    Unsave
                  </MenuItem>
                );

              return (
                <MenuItem onClick={() => handleMsgsOptions(e.id)} key={e.id}>
                  {e.title}
                </MenuItem>
              );
            }
          )}
        </Stack>
      </Menu>
    </>
  );
}
export default MessageOptions;
