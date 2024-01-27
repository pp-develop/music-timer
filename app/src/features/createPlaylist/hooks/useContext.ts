import * as React from 'react';

const response = {
  createPlaylist: {
    playlistId: '',
    isSpecifyFollowedArtists: false,
    followedArtistIds: [],
  },
};

export const ResponseContext = React.createContext(
  response.createPlaylist
);
