import React from 'react';
import { HeaderBackButton } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

const HeaderBack = () => {
  const navigation = useNavigation();

  if (!navigation) {
    return null;
  }

  return <HeaderBackButton onPress={() => navigation.goBack(null)} />;
};

export default HeaderBack;
