import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Icon, Button } from 'native-base';
import styled, { css } from 'styled-components';

const CameraActions = styled(View)`
  flex-direction: row;
  flex: 1;
  position: absolute;
  bottom: 35;
  left: 0;
  right: 0;
  justify-content: space-evenly;
`;

export default function BirdCameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ratio, setRatio] = useState('4:3');
  const [isTakingPhoto, setTakingPhoto] = useState(false);

  // Request permission to access Camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Set Ratio Available for Phone
  useEffect(() => {
    /* (async () => {
      if (Platform.OS === 'android' && camera) {
        console.log(camera.getSupportedRatiosAsync());
        const ratios = await camera.getSupportedRatiosAsync();
        const defaultRatio = ratios.find(availRatio => availRatio === DESIRED_RATIO) || '4:3';

        console.log('default Ratio', defaultRatio);
        setRatio(defaultRatio);
      }
    })(); */
  }, [camera]);

  if ((hasPermission === null || hasPermission) === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={cameraRef => {
          setCamera(cameraRef);
        }}
        type={Camera.Constants.Type.back}>
        <CameraActions>
          <Button
            style={{
              alignItems: 'center',
              backgroundColor: 'grey',
            }}
            onPress={() => {}}>
            <Icon type="MaterialIcons" name="camera" />
          </Button>
        </CameraActions>
      </Camera>
    </View>
  );
}
