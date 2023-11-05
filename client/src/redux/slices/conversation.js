import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_meessages: [],
  },
  group_chat: {},
  isLoading: false,
  isLoadingMsg: false,
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    getDirectConversations(state, action) {
      const list = action.payload.conversations.map((e) => {
        const this_user = e.members.find(
          (member) => member._id.toString() !== user_id
        );
        return {
          id: e._id,
          user_id: this_user._id,
          img: faker.image.avatar(),
          name: `${this_user.firstName} ${this_user.lastName}`,
          msg: faker.music.songName(),
          time: "9:36",
          unread: 0,
          pinned: false,
          online: this_user.status === "Online",
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (e) => {
          if (e.id !== this_conversation._id) {
            return e;
          } else {
            const user = this_conversation.members.find(
              (e) => e._id.toString() !== user_id
            );
            return {
              id: this_conversation._id,
              user_id: user._id,
              img: faker.image.avatar(),
              name: `${user.firstName} ${user.lastName}`,
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
              online: user.status === "Online",
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload;
      const user = this_conversation.members.find(
        (e) => e._id.toString() !== user_id
      );

      if (
        !state.direct_chat.conversations.some((e) => e.user_id === user._id)
      ) {
        state.direct_chat.conversations.push({
          id: this_conversation._id,
          user_id: user._id,
          img: faker.image.avatar(),
          name: `${user.firstName} ${user.lastName}`,
          msg: faker.music.songName(),
          time: "9:36",
          unread: 0,
          pinned: false,
          online: user.status === "Online",
        });
      }
    },
    setCurrentConversation(state, action) {
      state.isLoadingMsg = true;
      state.direct_chat.current_meessages = null;
      state.direct_chat.current_conversation = action.payload;
    },
    getCurrentMessages(state, action) {
      const formatted_messages = action.payload.messages.map((el) => {
        return {
          id: el._id,
          type: "msg",
          subtype: el.subtype,
          message: el.text,
          incoming: el.to === user_id,
          outgoing: el.from === user_id,
        };
      });

      state.direct_chat.current_meessages = formatted_messages;
      state.isLoadingMsg = false;
    },
    addDirectMessage(state, action) {
      const array = state?.direct_chat?.current_meessages;
      if (array === null) return;

      if (array[array.length - 1].id !== action.payload.id) {
        state.direct_chat.current_meessages.push(action.payload);
      }
    },
    clearConversation(state) {
      state.direct_chat.conversations = [];
      state.direct_chat.current_conversation = null;
      state.direct_chat.current_meessages = [];
      state.isLoading = false;
    },
    isLoading(state, action) {
      state.isLoading = action.payload;
    },
    isLoadingMsg(state, action) {
      state.isLoadingMsg = action.payload;
    },
  },
});
export default slice.reducer;

export function GetDirectConversations({ conversations }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.getDirectConversations({ conversations }));
  };
}

export function UpdateDirectConversation({ conversations }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversations }));
  };
}
export function AddDirectConversation(conversations) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation(conversations));
  };
}
export function SetConversation(current_room) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_room));
  };
}
export function GetCurrentMessages({ messages }) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.getCurrentMessages({ messages }));
  };
}
export function AddDirectMessage(message) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage(message));
  };
}
export function ClearConversation() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.clearConversation());
  };
}
export function IsLoading(isLoading) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.isLoading(isLoading));
  };
}

export function getDirectConversations() {
  return (state) => state.coversations.direct_chat;
}
export function getConversations() {
  return (state) => state.coversations;
}
export function getRoomId() {
  return (state) =>
    state.coversations.direct_chat?.current_conversation?.room_id;
}
