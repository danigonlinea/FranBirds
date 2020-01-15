import { Icon, View, Button } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Colors } from '../utils';
import styled, { css } from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deleteBird } from '../db';

const HorizontalContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const TakePhotoBtn = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  background-color: ${Colors.secondary};
  border-radius: 50;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HeaderMaterialBtn = styled(View)`
  right: 20px;
  top: 140px;
  position: absolute;
`;

const TakePhotoIcon = styled(Icon)`
  color: ${Colors.white};
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

const HeaderDetailsRight = withNavigation(({ navigation }) => {
  if (!navigation) {
    return null;
  }

  return (
    <HorizontalContainer>
      <HeaderMaterialBtn>
        <TakePhotoBtn
          activeOpacity={1.0}
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowOffset: {
              height: 4,
            },
            elevation: 10,
          }}
          onPress={() => console.log('yes')}>
          <TakePhotoIcon name="ios-camera" type="Ionicons" />
        </TakePhotoBtn>
      </HeaderMaterialBtn>
      <HeaderIconBtn
        transparent
        onPress={() =>
          Alert.alert(
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
                    navigation.getParam('bird') && navigation.getParam('bird').globalId,
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
          )
        }>
        <HeaderIcon name="ios-trash" />
      </HeaderIconBtn>
    </HorizontalContainer>
  );
});

export default HeaderDetailsRight;
