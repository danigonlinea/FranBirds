import { Button, Form, Input, View, Item } from 'native-base';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalCtx } from '../context/globalContext';

const SearchContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 64px;
  margin: 8px;
`;

const SearchBar = () => {
  const [textSearch, setTextSearch] = useState('');
  const { showSearchBar, searchBirdsByText } = useGlobalCtx();

  return showSearchBar ? (
    <SearchContainer>
      <Item rounded>
        <Input
          rounded
          autoFocus
          onEndEditing={() => searchBirdsByText(textSearch)}
          onChangeText={setTextSearch}
          value={textSearch}
          placeholder="Buscar"
        />
      </Item>
    </SearchContainer>
  ) : null;
};

export default SearchBar;
