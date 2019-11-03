import { Button, Icon } from 'native-base';
import React from 'react';
import { withNavigation } from 'react-navigation';
import { Colors } from '../utils';

const HeaderBack = withNavigation(({ navigation }) => {
  if (!navigation) {
    return null;
  }

  return (
    <Button icon transparent onPress={() => navigation.goBack(null)}>
      <Icon name="ios-arrow-back" style={{ color: Colors.headerIcon }} />
    </Button>
  );
});

export default HeaderBack;
