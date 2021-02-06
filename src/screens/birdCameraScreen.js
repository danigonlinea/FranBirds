import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Button, Icon, Spinner } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, View, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styled from 'styled-components';
import { NavStyle } from '../components';
import { Colors } from '../utils';

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

const BirdCameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ratio, setRatio] = useState('4:3');
  const [isTakingPhoto, setTakePhoto] = useState(false);
  const [isSavingPhoto, setSavePhoto] = useState(false);

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
      const defaultRatio = ratios.find((availRatio) => availRatio === DESIRED_RATIO) || '4:3';
      setRatio(defaultRatio);
    }
  };

  const capturePhoto = async () => {
    if (camera) {
      try {
        setTakePhoto(true);
        const photo = await camera.takePictureAsync();
        camera.pausePreview();
        setTakePhoto(false);
        setPreview(photo.uri);
      } catch (e) {
        setTakePhoto(false);
        console.log(e);
      }
    }
  };

  const discardPhoto = () => {
    if (camera) {
      camera.resumePreview();
      setPreview(null);
    }
  };

  const createDir = async (dir) => {
    const newDir = await FileSystem.getInfoAsync(dir);

    if (newDir.exists && newDir.isDirectory) {
      return newDir.uri;
    }

    await FileSystem.makeDirectoryAsync(dir);
    return newDir.uri;
  };

  const getPhotoName = (previewUri) => {
    const partPhoto = previewUri.split('/');

    return partPhoto[partPhoto.length - 1];
  };

  const savePhoto = async () => {
    if (camera) {
      setSavePhoto(true);
      try {
        const dirDestiny = await createDir(`${FileSystem.documentDirectory}images/`);

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

  const getCameraActions = () => {
    if (preview) {
      return (
        <>
          <CameraButton
            color={Colors.denied}
            onPress={() => (!isSavingPhoto ? discardPhoto() : false)}
          >
            <Icon type="MaterialIcons" name="clear" />
          </CameraButton>
          <CameraButton
            color={Colors.accept}
            onPress={() => (!isSavingPhoto ? savePhoto() : false)}
          >
            {!isSavingPhoto ? (
              <Icon type="MaterialIcons" name="check" />
            ) : (
              <View style={{ paddingLeft: 8, paddingRight: 8 }}>
                <Spinner color={Colors.primary} />
              </View>
            )}
          </CameraButton>
        </>
      );
    }

    return (
      <CameraButton
        color={Colors.defaultBackground}
        onPress={() => (!isTakingPhoto ? capturePhoto() : false)}
      >
        {!isTakingPhoto ? (
          <Icon type="MaterialIcons" name="camera" />
        ) : (
          <View style={{ paddingLeft: 8, paddingRight: 8 }}>
            <Spinner color={Colors.primary} />
          </View>
        )}
      </CameraButton>
    );
  };

  if ((hasPermission === null || hasPermission) === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        ref={(cameraRef) => {
          setCamera(cameraRef);
        }}
        ratio={ratio}
        onCameraReady={() => prepareRatio()}
        type={Camera.Constants.Type.back}
      >
        <CameraActions>{getCameraActions()}</CameraActions>
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

export default BirdCameraScreen;
