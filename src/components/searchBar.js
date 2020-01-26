import { Button, Form, Input, View, Item, Icon } from 'native-base';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalCtx } from '../context/globalContext';
import colors from '../utils/colors';

const SearchContainer = styled(View)`
  display: flex;

  justify-content: center;
  align-items: center;
  flex-direction: row;
  height: 64px;
  margin: 8px;
`;

const SearchInput = styled(Input)`
  border-color: ${colors.primary};
  border-width: 1px;
  border-radius: 25px;
`;

const ActionContainer = styled(Button)``;

const SearchBar = () => {
  const [textSearch, setTextSearch] = useState('');
  const { showSearchBar, setSearchBar, searchBirdsByText } = useGlobalCtx();

  return showSearchBar ? (
    <SearchContainer>
      <Item rounded style={{ flex: 1 }}>
        <SearchInput
          autoFocus
          onEndEditing={() => searchBirdsByText(textSearch)}
          onChangeText={setTextSearch}
          value={textSearch}
          placeholder="Buscar"
        />
      </Item>
      <ActionContainer
        transparent
        onPress={() => {
          setTextSearch('');
          searchBirdsByText('');
          setSearchBar(false);
        }}>
        <Icon type="MaterialIcons" name="clear" />
      </ActionContainer>
    </SearchContainer>
  ) : null;
};

export default SearchBar;
