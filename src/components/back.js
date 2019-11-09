import { Button, Icon } from 'native-base';
import React from 'react';
import { withNavigation } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack';
import { Colors } from '../utils';

const HeaderBack = withNavigation(({ navigation }) => {
  if (!navigation) {
    return null;
  }

  return <HeaderBackButton onPress={() => navigation.goBack(null)}></HeaderBackButton>;
});

export default HeaderBack;
