import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { Icon, Button } from 'native-base';
import styled, { css } from 'styled-components';
import { Colors } from '../utils';
import { NavStyle } from '../components';
import { withNavigation } from 'react-navigation';

const CameraActions = styled(View)`
  flex-direction: row;
  flex: 1;
  position: absolute;
  bottom: 35px;
  left: 0;
  right: 0;
  justify-content: space-evenly;
`;

const CameraButton = styled(Button)`
  background-color: ${({ color }) => color};
  border-radius: 12px;
  align-items: center;
`;

const BirdCameraScreen = ({ navigation }) => {
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
      setTakePhoto(false);

      setPreview(photo.uri);
    }
  };

  const discardPhoto = () => {
    if (camera) {
      camera.resumePreview();
      setPreview(null);
    }
  };

  const createDir = async dir => {
    const newDir = await FileSystem.getInfoAsync(dir);

    if (newDir.exists && newDir.isDirectory) {
      return newDir.uri;
    }

    await FileSystem.makeDirectoryAsync(dir);
    return newDir.uri;
  };

  const getPhotoName = previewUri => {
    const partPhoto = previewUri.split('/');

    return partPhoto[partPhoto.length - 1];
  };

  const savePhoto = async () => {
    if (camera) {
      try {
        const dirDestiny = await createDir(FileSystem.documentDirectory + 'images/');

        await FileSystem.moveAsync({
          from: preview,
          to: dirDestiny + getPhotoName(preview),
        });

        navigation.goBack();
        navigation.getParam('changePhoto')(dirDestiny + getPhotoName(preview));
      } catch (error) {
        console.log(error);
      }
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
              <CameraButton color={Colors.accept} onPress={cameraInfo => savePhoto()}>
                <Icon type="MaterialIcons" name="check" />
              </CameraButton>
            </>
          )}
        </CameraActions>
      </Camera>
    </View>
  );
};

BirdCameraScreen.navigationOptions = () => {
  return {
    ...NavStyle,
    headerShown: false,
  };
};

export default withNavigation(BirdCameraScreen);
