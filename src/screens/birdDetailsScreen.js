import {
  Container,
  Content,
  Input,
  Button,
  Item,
  Label,
  Text,
  Fab,
  Icon,
  Segment,
  Grid,
  Col,
  Card,
  CardItem,
  Row,
  Textarea,
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled, { css } from 'styled-components';
import { Back, HeaderDetailsRight, NavStyle, BirdPhotoDialog, Modal } from '../components';
import { Formik, useFormik } from 'formik';
import { Colors, Constants } from '../utils';
import * as Yup from 'yup';
import { NavKeys } from '.';
import { useGlobalCtx } from '../context/globalContext';
import { insertBird, updateBird, getBirdByGlobal } from '../db';
import colors from '../utils/colors';
import * as FileSystem from 'expo-file-system';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

const SelectBirdContainer = styled(Grid)``;

const SelectBirdBtn = styled(Button)`
  margin: 12px 0;
  height: 30px;
  border-color: ${props => (props.father ? Colors.male : Colors.female)};
`;

const SelectBirdIcon = styled(Icon)`
  color: ${props => (props.father ? Colors.male : Colors.female)};
`;

const SelectBirdText = styled(Text)`
  color: ${props => (props.father ? Colors.male : Colors.female)};
`;

const TextLabel = styled(Text)`
  color: #888;
  margin-top: 4px;
`;

const ErrorContainer = styled(View)`
  height: 36px;
  padding: 6px;
`;

const TextError = styled(Text)`
  color: #cf3030;
  font-size: 14px;
`;

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

const ModalBody = styled(View)`
  background-color: ${Colors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const Space = styled(View)`
  height: 12px;
`;

const birdValidationSchema = () => {
  return Yup.object().shape({
    globalId: Yup.number().nullable(),
    id: Yup.string()
      .required('El Identificador es necesario')
      .nullable(),
    type: Yup.string().nullable(),
    notes: Yup.string().nullable(),
    gender: Yup.string(),
    photo: Yup.string().nullable(),
    fatherId: Yup.string().nullable(),
    motherId: Yup.string().nullable(),
    fatherIdGlobal: Yup.string().nullable(),
    motherIdGlobal: Yup.string().nullable(),
  });
};

const getGenderFromParent = parentType => (parentType === 'Padre' ? 'Macho' : 'Hembra');

const BirdDetails = ({ navigation }) => {
  const [birdData, setBirdData] = useState({
    globalId: navigation.getParam('birdGlobalId'),
    id: null,
    type: null,
    notes: null,
    gender: 'Macho',
    photo: null,
    fatherId: null,
    fatherIdGlobal: null,
    motherId: null,
    motherIdGlobal: null,
  });

  const [modal, setModal] = useState({
    isVisible: false,
    parentGenderToSelect: null,
  });

  useEffect(() => {
    console.log('queryin... ', navigation.getParam('birdGlobalId'));
    if (birdData.globalId) {
      getBirdByGlobal(
        birdData.globalId,
        ({ result: birdInfo }) => {
          console.log('------- Database OK:', birdInfo);
          setBirdData(birdInfo[0]);
        },
        (ts, error) => console.log('Error', error)
      );
    }
  }, []);

  const photosToDeleteFromStorage = new Set();

  const submitBird = birdData => {
    try {
      photosToDeleteFromStorage.forEach(async photoToDelete => {
        await FileSystem.deleteAsync(photoToDelete, {
          idempotent: false,
        });
      });
    } catch (e) {
      console.log('Error: ', e);
    }

    if (birdData.globalId) {
      updateBird(
        birdData,
        () => {
          navigation.goBack();
          navigation.getParam('refreshBirdList')();
        },
        (ts, error) => console.log('Error', error)
      );
    } else {
      insertBird(
        birdData,
        ({ insertId }) => {
          navigation.goBack();
          navigation.getParam('refreshBirdList')();
          console.log('Inserted Id: ', insertId);
        },
        (ts, error) => console.log('Error Updating', error)
      );
    }
  };

  const getGenderColorSelected = gender => {
    if (gender === 'Macho') {
      return colors.male;
    } else if (gender === 'Hembra') {
      return colors.female;
    }

    return colors.egg;
  };

  if (!birdData) {
    return null;
  }

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
          enableReinitialize
          initialValues={birdData}
          validationSchema={birdValidationSchema()}
          onSubmit={submitBird}>
          {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => {
            //console.log('????', values);

            return (
              <>
                <Modal
                  title={`Asignar ${modal.parentGenderToSelect}`}
                  isVisible={modal.isVisible}
                  orientation="row"
                  onClose={() => {
                    setModal({
                      isVisible: false,
                      title: null,
                    });
                  }}>
                  <ModalBody>
                    <Button
                      onPress={() => {
                        setModal({ isVisible: false });
                        navigation.navigate(NavKeys.birdNewParent, {
                          genderParent: getGenderFromParent(modal.parentGenderToSelect),
                          assignParent: (globalId, parentId) => {
                            if (modal.parentGenderToSelect === 'Padre') {
                              setFieldValue('fatherIdGlobal', globalId);
                              setFieldValue('fatherId', parentId);
                            } else {
                              setFieldValue('motherIdGlobal', globalId);
                              setFieldValue('motherId', parentId);
                            }
                          },
                        });
                      }}>
                      <Text>Registrar como nuevo pájaro</Text>
                    </Button>
                    <Space></Space>
                    <Button
                      transparent
                      onPress={() => {
                        setModal({ isVisible: false });
                        navigation.navigate(NavKeys.birdSelectParent, {
                          currentBird: birdData,
                          genderParent: getGenderFromParent(modal.parentGenderToSelect),
                          assignParent: (globalId, parentId) => {
                            if (modal.parentGenderToSelect === 'Padre') {
                              setFieldValue('fatherIdGlobal', globalId);
                              setFieldValue('fatherId', parentId);
                            } else {
                              setFieldValue('motherIdGlobal', globalId);
                              setFieldValue('motherId', parentId);
                            }
                          },
                        });
                      }}>
                      <Text>Seleccionar un pájaro ya registrado</Text>
                    </Button>
                  </ModalBody>
                </Modal>
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
                              photosToDeleteFromStorage.add(photo);

                              setFieldValue('photo', photoFullPath);
                              setBirdData({
                                ...birdData,
                                photo: photoFullPath,
                              });
                            },
                          })
                        }>
                        <TakePhotoIcon name="ios-camera" type="Ionicons" />
                      </TakePhotoBtn>
                    </TakePhotoContainer>
                  </PhotoContainer>

                  <FormContainer>
                    <GenderSwitch>
                      <GenderButton
                        first
                        color={colors.egg}
                        genderColorSelected={getGenderColorSelected(values.gender)}
                        active={values.gender === 'Huevo'}
                        onPress={() => setFieldValue('gender', 'Huevo')}>
                        <GenderText
                          color={colors.egg}
                          genderColorSelected={getGenderColorSelected(values.gender)}
                          active={values.gender === 'Huevo'}>
                          Huevo
                        </GenderText>
                      </GenderButton>
                      <GenderButton
                        color={colors.male}
                        genderColorSelected={getGenderColorSelected(values.gender)}
                        active={values.gender === 'Macho'}
                        onPress={() => setFieldValue('gender', 'Macho')}>
                        <GenderText
                          color={colors.male}
                          genderColorSelected={getGenderColorSelected(values.gender)}
                          active={values.gender === 'Macho'}>
                          Macho
                        </GenderText>
                      </GenderButton>
                      <GenderButton
                        last
                        color={colors.female}
                        genderColorSelected={getGenderColorSelected(values.gender)}
                        active={values.gender === 'Hembra'}
                        onPress={() => setFieldValue('gender', 'Hembra')}>
                        <GenderText
                          color={colors.female}
                          genderColorSelected={getGenderColorSelected(values.gender)}
                          active={values.gender === 'Hembra'}>
                          Hembra
                        </GenderText>
                      </GenderButton>
                    </GenderSwitch>
                    <VerticalSpace></VerticalSpace>
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
                          <FormItem stackedLabel>
                            <Label>Padres</Label>
                            <Row>
                              <Col style={{ marginRight: 6 }}>
                                {values.fatherId ? (
                                  <>
                                    <Grid>
                                      <Col size={50}>
                                        <SelectBirdBtn
                                          bordered
                                          unded
                                          active
                                          father
                                          onPress={() =>
                                            navigation.push(NavKeys.birdDetails, {
                                              birdGlobalId: values.fatherIdGlobal,
                                            })
                                          }>
                                          <SelectBirdText father>{values.fatherId}</SelectBirdText>
                                        </SelectBirdBtn>
                                      </Col>
                                      <Col size={30}>
                                        <SelectBirdBtn
                                          transparent
                                          active
                                          father
                                          onPress={() => setFieldValue('fatherId', null)}>
                                          <SelectBirdIcon
                                            type="MaterialIcons"
                                            name="close"
                                            father
                                          />
                                        </SelectBirdBtn>
                                      </Col>
                                    </Grid>
                                  </>
                                ) : (
                                  <SelectBirdBtn
                                    bordered
                                    iconLeft
                                    rounded
                                    active
                                    father
                                    onPress={() =>
                                      setModal({
                                        isVisible: true,
                                        parentGenderToSelect: 'Padre',
                                      })
                                    }>
                                    <SelectBirdIcon type="MaterialIcons" name="add" father />
                                    <SelectBirdText father>Añadir</SelectBirdText>
                                  </SelectBirdBtn>
                                )}
                              </Col>
                              <Col style={{ marginLeft: 6 }}>
                                {values.motherId ? (
                                  <>
                                    <Grid>
                                      <Col size={50}>
                                        <SelectBirdBtn
                                          bordered
                                          rounded
                                          active
                                          mother
                                          onPress={() => {
                                            navigation.push(NavKeys.birdDetails, {
                                              birdGlobalId: values.motherIdGlobal,
                                            });
                                          }}>
                                          <SelectBirdText mother>{values.motherId}</SelectBirdText>
                                        </SelectBirdBtn>
                                      </Col>
                                      <Col size={30}>
                                        <SelectBirdBtn
                                          transparent
                                          active
                                          mother
                                          onPress={() =>
                                            setFieldValue('motherId', null) && assignMother(null)
                                          }>
                                          <SelectBirdIcon
                                            type="MaterialIcons"
                                            name="close"
                                            mother
                                          />
                                        </SelectBirdBtn>
                                      </Col>
                                    </Grid>
                                  </>
                                ) : (
                                  <SelectBirdBtn
                                    bordered
                                    iconLeft
                                    rounded
                                    active
                                    mother
                                    onPress={() =>
                                      setModal({
                                        isVisible: true,
                                        parentGenderToSelect: 'Madre',
                                      })
                                    }>
                                    <SelectBirdIcon type="MaterialIcons" name="add" mother />
                                    <SelectBirdText mother>Añadir</SelectBirdText>
                                  </SelectBirdBtn>
                                )}
                              </Col>
                            </Row>
                          </FormItem>
                          <Row>
                            <FormItem style={{ flex: 1 }} stackedLabel>
                              <Label>Notas</Label>
                              <NotasField
                                rowSpan={3}
                                multiline={true}
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
            );
          }}
        </Formik>
      </DetailsContainer>
    </KeyboardAvoidingView>
  );
};

BirdDetails.navigationOptions = ({ navigation }) => {
  return {
    ...NavStyle,
    headerStyle: {
      backgroundColor: 'transparent',
    },
    headerTransparent: {
      position: 'absolute',
    },
    headerTitle: () => null,
    headerLeft: () => <Back></Back>,
    headerRight: () => <HeaderDetailsRight></HeaderDetailsRight>,
  };
};

export default withNavigation(BirdDetails);
