import React, { createContext, useContext, useState } from 'react';

const GlobalCtx = createContext();

export const useGlobalCtx = () => {
  return useContext(GlobalCtx);
};

const GlobalContext = ({ children }) => {
  const [filterSelected, setFilterSelected] = useState(0);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [textToSearch, setTextToSearch] = useState('');
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
        filterSelected,
        setFilter: newFilterOption => {
          setFilterSelected(newFilterOption);
        },
        showSearchBar,
        setSearchBar: value => {
          setShowSearchBar(value);
        },
        textToSearch,
        searchBirdsByText: text => {
          setTextToSearch(text);
        },
      }}>
      {children}
    </GlobalCtx.Provider>
  );
};

export default GlobalContext;
