import { Button, Icon } from 'native-base';
import React from 'react';
import styled from 'styled-components';
import { useGlobalCtx } from '../context/globalContext';
import colors from '../utils/colors';

const SearchIcon = styled(Icon)`
  color: ${({ iconColor }) => iconColor || colors.black};
`;

const SearchAction = ({ iconColor }) => {
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
      <SearchIcon type="MaterialIcons" name="search" iconColor={iconColor} />
    </Button>
  );
};

export default SearchAction;
