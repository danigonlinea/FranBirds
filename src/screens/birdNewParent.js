import * as FileSystem from 'expo-file-system';
import { Formik } from 'formik';
import {
  Button,
  Card,
  CardItem,
  Col,
  Container,
  Content,
  Fab,
  Grid,
  Icon,
  Input,
  Item,
  Label,
  Row,
  Segment,
  Text,
  Textarea,
} from 'native-base';
import React from 'react';
import { Image, KeyboardAvoidingView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withNavigation } from 'react-navigation';
import styled, { css } from 'styled-components';
import * as Yup from 'yup';
import { NavKeys } from '.';
import { Back, NavStyle } from '../components';
import { insertBird } from '../db';
import { Colors } from '../utils';
import colors from '../utils/colors';
import { getDefaultAvatar } from '../utils/functions';

const DetailsContainer = styled(Container)``;

const FabSave = styled(Fab)`
  background-color: ${Colors.fabSave};
`;

const FabIcon = styled(Icon)`
  font-size: 28px;
  color: ${Colors.white};
`;

const FormContainer = styled(View)`
  flex: 1;
  padding: 22px;
`;

const FormItem = styled(Item)`
  margin: 0 8px 16px 8px;
`;

const GenderSwitch = styled(Segment)``;

const GenderButton = styled(Button)(
  ({ active, color, genderColorSelected }) => css`
    border-color: ${active ? color : genderColorSelected};
    background-color: ${active ? color : Colors.white};
  `
);

const GenderText = styled(Text)(
  ({ active, genderColorSelected }) => css`
    color: ${active ? Colors.white : genderColorSelected};
  `
);

const NotasField = styled(Textarea)`
  width: 100%;
  padding: 8px 0;
  margin: 0;
`;

const VerticalSpace = styled(View)`
  padding: 8px;
`;

const ErrorContainer = styled(View)`
  height: 36px;
  padding: 6px;
`;

const TextError = styled(Text)`
  color: #cf3030;
  font-size: 14px;
`;

const birdValidationSchema = () => {
  return Yup.object().shape({
    globalId: Yup.number().nullable(),
    id: Yup.string().required('El Identificador es necesario').nullable(),
    type: Yup.string().nullable(),
    notes: Yup.string().nullable(),
    gender: Yup.string(),
    photo: Yup.string().nullable(),
  });
};

const birdFormValues = birdGender => {
  return {
    globalId: null,
    id: null,
    type: null,
    notes: null,
    gender: birdGender,
    photo: null,
    fatherIdGlobal: null,
    motherIdGlobal: null,
  };
};

const TakePhotoIcon = styled(Icon)`
  color: ${Colors.white};
`;

const TakePhotoContainer = styled(View)`
  position: relative;
  display: flex;
  top: -30px;
  margin-right: 24px;

  align-self: flex-end;
`;
const TakePhotoBtn = styled(TouchableOpacity)`
  width: 60px;
  height: 60px;
  background-color: ${Colors.secondary};
  border-radius: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PhotoContainer = styled(View)`
  height: 250px;
`;

const getGenderColorSelected = gender => {
  if (gender === 'Macho') {
    return colors.male;
  }
  return colors.female;
};

const renderGenderButton = gender => (
  <GenderButton
    color={getGenderColorSelected(gender)}
    genderColorSelected={getGenderColorSelected(gender)}
    active>
    <GenderText active>{gender}</GenderText>
  </GenderButton>
);

const BirdNewParent = ({ navigation }) => {
  const photosToDeleteFromStorage = new Set();

  const submitBird = birdFormData => {
    try {
      photosToDeleteFromStorage.forEach(async photoToDelete => {
        await FileSystem.deleteAsync(photoToDelete, {
          idempotent: false,
        });
      });
    } catch (e) {
      console.log('Error: ', e);
    }

    insertBird(
      birdFormData,
      ({ insertId }) => {
        navigation.goBack();
        navigation.getParam('assignParent')(insertId, birdFormData.id);
      },
      (ts, error) => console.log('Error Updating', error)
    );
  };

  return (
    <KeyboardAvoidingView
      style={{
        paddingBottom: 0,
        flex: 1,
      }}
      keyboardVerticalOffset={0}
      behavior="padding"
      enabled>
      <DetailsContainer>
        <Formik
          initialValues={birdFormValues(navigation.getParam('genderParent'))}
          validationSchema={birdValidationSchema()}
          onSubmit={submitBird}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
            <>
              <Content style={{ flex: 1 }}>
                <PhotoContainer>
                  <Image
                    style={{ height: 250 }}
                    source={{
                      uri: values.photo ? values.photo : getDefaultAvatar(values.gender),
                    }}
                  />

                  <TakePhotoContainer>
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
                      onPress={() =>
                        navigation.navigate(NavKeys.birdCamera, {
                          changePhoto: async photoFullPath => {
                            // Remove previous photo
                            photosToDeleteFromStorage.add(values.photo);

                            setFieldValue('photo', photoFullPath);
                          },
                        })
                      }>
                      <TakePhotoIcon name="ios-camera" type="Ionicons" />
                    </TakePhotoBtn>
                  </TakePhotoContainer>
                </PhotoContainer>

                <FormContainer>
                  <GenderSwitch>{renderGenderButton(values.gender)}</GenderSwitch>
                  <VerticalSpace />
                  <Card>
                    <CardItem>
                      <Grid>
                        <Row>
                          <Col>
                            <FormItem stackedLabel>
                              <Label>Identificador</Label>
                              <Input
                                onChangeText={handleChange('id')}
                                onBlur={handleBlur('id')}
                                value={values.id}
                                returnKeyType="done"
                              />
                            </FormItem>
                          </Col>
                          <Col>
                            <FormItem stackedLabel>
                              <Label>Tipo</Label>
                              <Input
                                onChangeText={handleChange('type')}
                                onBlur={handleBlur('type')}
                                value={values.type}
                                returnKeyType="done"
                              />
                            </FormItem>
                          </Col>
                        </Row>
                        {errors && errors.id && (
                          <Row>
                            <Col>
                              <ErrorContainer>
                                <TextError>{errors.id}</TextError>
                              </ErrorContainer>
                            </Col>
                          </Row>
                        )}

                        <Row>
                          <FormItem style={{ flex: 1 }} stackedLabel>
                            <Label>Notas</Label>
                            <NotasField
                              rowSpan={3}
                              multiline
                              onChangeText={handleChange('notes')}
                              onBlur={handleBlur('notes')}
                              value={values.notes}
                            />
                          </FormItem>
                        </Row>
                      </Grid>
                    </CardItem>
                  </Card>
                </FormContainer>
              </Content>
              <View>
                <FabSave active containerStyle={{}} position="bottomRight" onPress={handleSubmit}>
                  <FabIcon name="ios-save" />
                </FabSave>
              </View>
            </>
          )}
        </Formik>
      </DetailsContainer>
    </KeyboardAvoidingView>
  );
};

BirdNewParent.navigationOptions = () => {
  return {
    ...NavStyle,
    headerStyle: {
      backgroundColor: 'transparent',
    },
    headerTransparent: {
      position: 'absolute',
    },
    headerTitle: () => null,
    headerLeft: () => <Back />,
    headerRight: () => null,
  };
};

export default withNavigation(BirdNewParent);
