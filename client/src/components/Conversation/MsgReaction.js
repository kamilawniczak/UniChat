import { Grid, Tooltip } from "@mui/material";
import React from "react";

const MsgReaction = ({ reactions }) => {
  const reactionCounts = reactions.reduce((accumulator, currentValue) => {
    const reactionObject = accumulator.find(
      (e) => e?.icon === currentValue.reaction
    );

    const fullName = `${currentValue.by?.firstName || "Unknown"} ${
      currentValue.by?.lastName || "user"
    } \n`;

    if (reactionObject) {
      reactionObject.amount += 1;
      reactionObject.users.push(fullName);
    } else {
      accumulator.push({
        icon: currentValue.reaction,
        amount: 1,
        users: [fullName],
      });
    }
    return accumulator;
  }, []);

  return (
    <Grid container spacing={0.1}>
      {reactionCounts.map((e) => (
        <Grid item sx={{ borderRadius: 1 }} key={e.icon}>
          <Tooltip
            placement="bottom"
            title={<div style={{ whiteSpace: "pre-line" }}>{e.users}</div>}
            key={e.icon}
          >
            {e.icon}
            {e.amount}
          </Tooltip>
        </Grid>
      ))}
    </Grid>
  );
};

export default MsgReaction;
