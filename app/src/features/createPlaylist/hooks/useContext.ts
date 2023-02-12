import * as React from 'react';

const response = {
  createPlaylist: {
      playlistId: '',
      isFavoriteArtists: false,
  },
};

export const ResponseContext = React.createContext(
  response.createPlaylist
);
