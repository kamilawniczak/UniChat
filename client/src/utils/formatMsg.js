import { socket } from "../socket";

export function getFileNameFromUrl(url) {
  const pathname = new URL(url).pathname;
  const match = pathname.match(/\$\$\$(.+)$/);
  return match ? match[1] : null;
}
export function handleDownload(fileUrl) {
  const newWindow = window.open(fileUrl, "_blank");
  if (newWindow) {
    newWindow.opener = null;
  }
}
export function handleMsgReaction({ emoji, id, room_id, chatType }) {
  const user_id = window.localStorage.getItem("user_id");

  socket.emit("reactToMsg", {
    emoji,
    msgId: id,
    chat_type: chatType,
    room_id,
    user_id,
  });
}
export const splitMessage = (message) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = urlRegex.exec(message);

  if (match) {
    const link = match[0];
    const index = match.index;
    const textBeforeLink = message.slice(0, index).trim();
    const textAfterLink = message.slice(index + link.length).trim();

    return {
      textBeforeLink,
      textAfterLink,
      link,
    };
  }

  return {
    textBeforeLink: message,
    textAfterLink: "",
    link: null,
  };
};
