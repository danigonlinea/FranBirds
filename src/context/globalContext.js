import React, { createContext, useContext, useState } from 'react';

const GlobalCtx = createContext();

export const useGlobalCtx = () => {
  return useContext(GlobalCtx);
};

const GlobalContext = ({ children }) => {
  const [dataModal, setDataModa] = useState({
    toggleDialog: false,
    bird: undefined,
  });

  return (
    <GlobalCtx.Provider
      value={{
        dataModal,
        setDataModal: data => {
          setDataModa(data);
        },
      }}>
      {children}
    </GlobalCtx.Provider>
  );
};

export default GlobalContext;
