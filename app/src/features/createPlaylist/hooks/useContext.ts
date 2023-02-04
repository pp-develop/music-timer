import * as React from 'react';

const response = {
  createPlaylist: {
      playlistId: '',
  },
};

export const ResponseContext = React.createContext(
  response.createPlaylist
);
