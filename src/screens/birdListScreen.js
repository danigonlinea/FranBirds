import React, { useEffect, useState } from 'react';
import { Container, Text } from 'native-base';
import { NavStyle } from '../components';

const BirdListScreen = props => {
  useEffect(() => {
    console.log('BirdDetails');
  }, []);

  return (
    <Container>
      <Text>Bird List Screen</Text>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: undefined,
  headerTitle: 'Birds List',
};

export default BirdListScreen;
