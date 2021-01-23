import React from 'react';
import { withNavigation } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack';

const HeaderBack = withNavigation(({ navigation }) => {
  if (!navigation) {
    return null;
  }

  return <HeaderBackButton onPress={() => navigation.goBack(null)} />;
});

export default HeaderBack;
