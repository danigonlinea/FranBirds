import { Button, Icon } from 'native-base';
import React from 'react';
import { useGlobalCtx } from '../context/globalContext';
import colors from '../utils/colors';
import styled from 'styled-components';

const SearchIcon = styled(Icon)`
  color: ${colors.black};
`;

const SearchAction = () => {
  const { showSearchBar, setSearchBar, setFilter } = useGlobalCtx();

  return (
    <Button
      icon
      transparent
      onPress={() => {
        setSearchBar(!showSearchBar);

        if (!showSearchBar) {
          setFilter(0);
        }
      }}>
      <SearchIcon type="MaterialIcons" name="search" />
    </Button>
  );
};

export default SearchAction;
