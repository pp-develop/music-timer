import * as React from 'react';

const PlaylistContext = React.createContext({
  showDeleteButton: false,
  setShowDeleteButton: (value: boolean) => {}, // 状態を更新するための関数
});

export const PlaylistProvider = ({ children }: { children: React.ReactNode }) => {
  const [showDeleteButton, setShowDeleteButton] = React.useState(false);

  return (
    <PlaylistContext.Provider value={{ showDeleteButton, setShowDeleteButton }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default PlaylistContext;
