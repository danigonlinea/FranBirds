import React, { useEffect, useState } from 'react';
import { Container, Text } from 'native-base';
import { Back, NavStyle } from '../components';
import { withNavigation } from 'react-navigation';

const BirdDetails = ({ navigation }) => {
  const id = navigation.getParam('id');

  useEffect(() => {
    console.log('BirdDetails: ', id ? id : 'New Bird');
  }, []);

  return (
    <Container>
      <Text>Bird Details</Text>
    </Container>
  );
};

BirdDetails.navigationOptions = {
  ...NavStyle,
  headerLeft: <Back></Back>,
  headerTitle: 'Birds Details',
};

export default withNavigation(BirdDetails);
