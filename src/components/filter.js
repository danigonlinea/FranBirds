import { Button, Icon, Picker, Form } from 'native-base';
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
  const { filterSelected, setFilter } = useGlobalCtx();

  useEffect(() => {});

  /* const filterChange = value => {
    setSelected(value);
  }; */

  return (
    <FilterBirds>
      <GenderFilter mode="dropdown" selectedValue={filterSelected} onValueChange={setFilter}>
        <Picker.Item label="Todos" value={0} />
        <Picker.Item label="Machos" value={1} />
        <Picker.Item label="Hembras" value={2} />
      </GenderFilter>
    </FilterBirds>
  );
};

export default Filter;
