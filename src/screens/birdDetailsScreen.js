import React, { useEffect, useState } from 'react';
import { Container, Text, Button, Icon, Content } from 'native-base';
import { Back, NavStyle, HeaderDetailsRight } from '../components';
import { withNavigation } from 'react-navigation';
import { StyleSheet, Image, View } from 'react-native';
import styled, { css } from 'styled-components';
import { Colors } from '../utils';

const DetailsContainer = styled(Container)`
  margin-top: 180px;
`;

const BirdDetails = ({ navigation }) => {
  const id = navigation.getParam('id');

  useEffect(() => {
    console.log('BirdDetails: ', id ? id : 'New Bird');
  }, []);

  return (
    <DetailsContainer>
      <Content>
        <Text>Bird Details</Text>
      </Content>
    </DetailsContainer>
  );
};

BirdDetails.navigationOptions = ({ navigation }) => {
  const photo = navigation.getParam('photo');
  return {
    ...NavStyle,
    headerLeft: <Back></Back>,
    headerRight: <HeaderDetailsRight></HeaderDetailsRight>,
    headerBackground: <Image style={{ height: 260 }} source={{ uri: photo }} />,
  };
};

export default withNavigation(BirdDetails);
