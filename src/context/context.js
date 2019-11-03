import React, { createContext, useContext, useState } from 'react';

const GlobalCtx = createContext();

export const useGlobalCtx = () => {
  return useContext(GlobalCtx);
};

const GlobalContext = () => {
  const [show, setShow] = useState(false);

  return (
    <GlobalCtx.Provider
      value={{
        isDialogShowing: show,
        setDialogShowing: value => {
          setShow(value);
        },
      }}>
      {children}
    </GlobalCtx.Provider>
  );
};

export default GlobalContext;
