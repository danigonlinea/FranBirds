import React, { useState } from 'react';
import { Text, View, Image } from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';
import { useGlobalCtx } from '../context/globalContext';
import styled from 'styled-components';
import NavKeys from '../screens/navKeys';
import { withNavigation } from 'react-navigation';
import { Colors } from '../utils';

const Photo = styled(Image)`
  width: 100%;
  height: 300px;
`;

const ModalBody = styled(View)`
  background-color: ${Colors.white};
`;

const BirdInfo = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const Btn = styled(Button)`
  background-color: ${props => (props.type === 'Macho' ? Colors.male : Colors.female)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

const BtnText = styled(Text)`
  color: ${Colors.white};
`;

const BirdPhotoDialog = ({ navigation }) => {
  const {
    dataModal: { bird, isDialogShowing },
    setDataModal,
  } = useGlobalCtx();

  const hideModal = {
    bird: undefined,
    isDialogShowing: false,
  };

  if (!bird) {
    return null;
  }

  return (
    <Modal
      backdropOpacity={0.5}
      isVisible={isDialogShowing}
      onBackButtonPress={() => {
        setDataModal(hideModal);
      }}
      onBackdropPress={() => {
        setDataModal(hideModal);
      }}>
      <ModalBody>
        <Photo source={{ uri: bird.photo }} />

        <View>
          <BirdInfo>
            <Text>{bird.id}</Text>
            <Text>{bird.type}</Text>
            <Text>{bird.gender}</Text>
          </BirdInfo>
          <Btn
            type={bird.gender}
            onPress={() => {
              setDataModal(hideModal);
              navigation.navigate(NavKeys.birdDetails, { id: bird.id });
            }}>
            <BtnText>Ver Más Detalles</BtnText>
          </Btn>
        </View>
      </ModalBody>
    </Modal>
  );
};

export default withNavigation(BirdPhotoDialog);
