import { Button, Icon, Picker, Form, Text } from 'native-base';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colors } from '../utils';
import { useGlobalCtx } from '../context/globalContext';

const FilterBirds = styled(Form)`
  flex: 1;
  padding: 0 24px;
`;

const GenderFilter = styled(Picker)`
  width: 200px;
`;

const Filter = () => {
  const { filterSelected, setFilter, showSearchBar } = useGlobalCtx();

  return (
    <FilterBirds>
      {showSearchBar ? (
        <Text>Todos</Text>
      ) : (
        <GenderFilter mode="dropdown" selectedValue={filterSelected} onValueChange={setFilter}>
          <Picker.Item label="Todos" value={0} />
          <Picker.Item label="Huevos" value={1} />
          <Picker.Item label="Machos" value={2} />
          <Picker.Item label="Hembras" value={3} />
        </GenderFilter>
      )}
    </FilterBirds>
  );
};

export default Filter;
