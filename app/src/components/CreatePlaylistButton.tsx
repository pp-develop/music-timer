import React from "react";
import { Button } from "@rneui/base";

export const CreatePlaylistButton = (prop: any) => {

    return (
        <Button
            title="Create Playlist"
            buttonStyle={{
                backgroundColor: 'black',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
            }}
            containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
            }}
            titleStyle={{ fontWeight: 'bold' }}
            onPress={prop.onclick}
        />
    );
}

