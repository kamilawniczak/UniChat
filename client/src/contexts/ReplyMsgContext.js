import React, { createContext, useContext, useState } from "react";

const initialState = {
  msgId: null,
  type: null,
  file: null,
  text: null,

  onSetMsgId: () => {},
  onResetMsgId: () => {},
};

const StateContext = createContext(initialState);

const StateProvider = ({ children }) => {
  const [replyInfo, setReplyInfo] = useState(initialState);

  const onSetMsgId = (data) => {
    setReplyInfo(data);
  };
  const onResetMsgId = () => {
    setReplyInfo({ msgId: null, type: null, file: null, text: null });
  };

  return (
    <StateContext.Provider
      value={{
        replyMsgId: replyInfo.msgId,
        replyType: replyInfo.type,
        replyFile: replyInfo.file,
        replyText: replyInfo.text,
        onSetMsgId,
        onResetMsgId,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

const useReplayMsgContext = () => useContext(StateContext);

export { StateProvider, useReplayMsgContext };
