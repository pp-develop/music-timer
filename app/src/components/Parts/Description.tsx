import React from "react";
import { Text } from "@rneui/base";

export const Description = () => {
  return (
    <Text
      h3
      h3Style={{
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
      }}
      style={{
        paddingLeft: 47,
        paddingBottom: 12,
        paddingRight: 32,
        backgroundColor: "black",
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%'
      }}
    >
      Create a playlist by specifying the time.
    </Text>
  );
}