import { Button, Icon, View } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components';
import { deleteBird } from '../db';
import { Colors } from '../utils';

const HorizontalContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HeaderIcon = styled(Icon)`
  font-size: 28px;
  color: ${Colors.black};
`;

const HeaderIconBtn = styled(Button)`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderDetailsRight = () => {
  const navigation = useNavigation();
  if (!navigation) {
    return null;
  }

  return (
    <HorizontalContainer>
      <HeaderIconBtn
        transparent
        onPress={() => Alert.alert(
          'Eliminar Pájaro',
          '¿Estás seguro de eliminar este pájaro?',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Si',
              onPress: () => {
                deleteBird(
                  navigation.getParam('birdGlobalId'),
                  () => {
                    navigation.goBack();
                    navigation.getParam('refreshBirdList')();
                  },
                  (ts, error) => console.log('Error Deleting', error)
                );
              },
            },
          ],
          { cancelable: false }
        )}
      >
        <HeaderIcon name="ios-trash" />
      </HeaderIconBtn>
    </HorizontalContainer>
  );
};

export default HeaderDetailsRight;
