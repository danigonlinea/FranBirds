import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Icon, Button } from 'native-base';
import styled, { css } from 'styled-components';
import { Colors } from '../utils';
import { NavStyle } from '../components';

BirdCameraScreen.navigationOptions = () => {
  return {
    ...NavStyle,
    header: null,
  };
};

const CameraActions = styled(View)`
  flex-direction: row;
  flex: 1;
  position: absolute;
  bottom: 35;
  left: 0;
  right: 0;
  justify-content: space-evenly;
`;

const CameraButton = styled(Button)`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: center;
`;

export default function BirdCameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ratio, setRatio] = useState('4:3');
  const [isTakingPhoto, setTakePhoto] = useState(false);

  const DESIRED_RATIO = '16:9';
  // Request permission to access Camera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Set Ratio Available for Phone
  const prepareRatio = async () => {
    if (Platform.OS === 'android' && camera) {
      const ratios = await camera.getSupportedRatiosAsync();
      const defaultRatio = ratios.find(availRatio => availRatio === DESIRED_RATIO) || '4:3';
      setRatio(defaultRatio);
    }
  };

  const capturePhoto = async () => {
    if (camera) {
      setTakePhoto(true);
      const photo = await camera.takePictureAsync();
      camera.pausePreview();
      setTakePhoto(true);

      console.log(photo);
      setPreview(photo.uri);
    }
  };

  const discardPhoto = () => {
    if (camera) {
      camera.resumePreview();
      setPreview(null);
    }
  };

  const savePhoto = async () => {
    if (camera) {
      const base64 = await FileSystem.readAsStringAsync(preview, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('data:image/png;base64,' + base64.substring(0, 15));
    }
  };

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
        ratio={ratio}
        onCameraReady={() => prepareRatio()}
        type={Camera.Constants.Type.back}>
        <CameraActions>
          {!preview ? (
            <CameraButton color={Colors.defaultBackground} onPress={() => capturePhoto()}>
              <Icon type="MaterialIcons" name="camera" />
            </CameraButton>
          ) : (
            <>
              <CameraButton color={Colors.denied} onPress={() => discardPhoto()}>
                <Icon type="MaterialIcons" name="clear" />
              </CameraButton>
              <CameraButton color={Colors.accept} onPress={uri => savePhoto(uri)}>
                <Icon type="MaterialIcons" name="check" />
              </CameraButton>
            </>
          )}
        </CameraActions>
      </Camera>
    </View>
  );
}
