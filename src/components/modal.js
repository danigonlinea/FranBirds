import { Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import colors from '../utils/colors';

const Header = styled(View)`
  height: 48px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled(Text)`
  color: ${colors.white};
  font-size: 18px;
`;

const CustomModal = withNavigation(
  ({ navigation, title, backgroundColor, isVisible, onClose, children }) => {
    if (!navigation) {
      return null;
    }

    return (
      <Modal
        backdropOpacity={0.5}
        isVisible={isVisible}
        animationIn="zoomIn"
        animationInTiming={230}
        backdropTransitionInTiming={230}
        animationOut="zoomOut"
        animationOutTiming={230}
        backdropTransitionOutTiming={230}
        useNativeDriver={true}
        onBackButtonPress={() => {
          onClose();
        }}
        onBackdropPress={() => {
          onClose();
        }}>
        {title && (
          <Header backgroundColor={backgroundColor}>
            <Title>{title}</Title>
          </Header>
        )}
        {children}
      </Modal>
    );
  }
);

export default CustomModal;
