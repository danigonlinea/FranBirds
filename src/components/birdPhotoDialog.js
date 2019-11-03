import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'native-base';
import Modal from 'react-native-modal';

const BirdPhotoDialog = ({ children }) => {
  const [visible, setVisible] = useState(true);

  return (
    <View>
      <Modal
        backdropOpacity={0.5}
        isVisible={visible}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {}}>
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Hello World!</Text>

            <Button
              onPress={() => {
                setVisible(false);
              }}>
              <Text>Hide Modal</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BirdPhotoDialog;
