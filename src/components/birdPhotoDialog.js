import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';
import { useGlobalCtx } from '../context/globalContext';
import styled from 'styled-components';
import NavKeys from '../screens/navKeys';
import { withNavigation } from 'react-navigation';
import { Colors, Constants } from '../utils';
import { getDefaultAvatar } from '../utils/functions';

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
    dataModal: { bird, toggleDialog },
    setDataModal,
  } = useGlobalCtx();

  const [showModal, setShowModal] = useState(toggleDialog);

  useEffect(() => {
    setShowModal(true);
  }, [toggleDialog]);

  useEffect(() => {
    if (!showModal) {
      /*  setDataModal({
        bird: null,
        toggleDialog: false,
      }); */
    }
  }, [showModal]);

  if (!bird) {
    return null;
  }

  return (
    <Modal
      backdropOpacity={0.5}
      isVisible={showModal}
      animationIn="zoomIn"
      animationInTiming={230}
      backdropTransitionInTiming={230}
      animationOut="zoomOut"
      animationOutTiming={230}
      backdropTransitionOutTiming={230}
      useNativeDriver={true}
      onBackButtonPress={() => {
        setShowModal(false);
      }}
      onBackdropPress={() => {
        setShowModal(false);
      }}>
      <ModalBody>
        <Photo source={{ uri: bird.photo ? bird.photo : getDefaultAvatar(bird.gender) }} />
        <View>
          <BirdInfo>
            <Text>{bird.id}</Text>
            <Text>{bird.type}</Text>
          </BirdInfo>
          <Btn
            type={bird.gender}
            onPress={() => {
              setDataModal({
                bird: null,
                toggleDialog: false,
              });
              // setShowModal(false);
              navigation.navigate(NavKeys.birdDetails, { birdGlobalId: bird.globalId });
            }}>
            <BtnText>Ver Más Detalles</BtnText>
          </Btn>
        </View>
      </ModalBody>
    </Modal>
  );
};

export default withNavigation(BirdPhotoDialog);
