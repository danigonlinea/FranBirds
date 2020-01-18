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
import { Back, HeaderDetailsRight, NavStyle, BirdPhotoDialog } from '../components';
import { Formik, useFormik } from 'formik';
import { Colors, Constants } from '../utils';
import * as Yup from 'yup';
import { NavKeys } from '.';
import { useGlobalCtx } from '../context/globalContext';
import { insertBird, updateBird } from '../db';
import colors from '../utils/colors';
import * as FileSystem from 'expo-file-system';

const DetailsContainer = styled(Container)`
  margin-top: 140px;
`;

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
  });
};

const birdFormValues = bird => {
  return bird.globalId
    ? { ...bird }
    : {
        globalId: null,
        id: null,
        type: null,
        notes: null,
        gender: 'Macho',
        photo: Constants.defaultAvatar,
        fatherId: null,
        motherId: null,
      };
};

const ImageContainer = styled(Image)`
  height: 300px;
  width: 200px;
`;

const BirdDetails = ({ navigation }) => {
  const [birdData, setBirdData] = useState(navigation.getParam('bird'));
  const [fatherId, setFather] = useState(birdData.fatherId || false);
  const [motherId, setMother] = useState(birdData.motherId || false);

  const assignFather = fatherId => {
    setFather(fatherId);
  };

  const assignMother = motherId => {
    setMother(motherId);
  };

  const { globalId, id, type, notes, gender, photo } = birdData;

  const submitBird = birdData => {
    if (globalId) {
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

  return (
    <KeyboardAvoidingView
      style={{
        paddingBottom: 0,
        flex: 1,
        justifyContent: 'center',
      }}
      keyboardVerticalOffset={72}
      behavior="height"
      enabled>
      <DetailsContainer>
        <Formik
          initialValues={birdFormValues(birdData)}
          validationSchema={birdValidationSchema()}
          onSubmit={submitBird}>
          {({ handleChange, handleBlur, handleSubmit, touched, values, errors, setFieldValue }) => (
            <>
              <Content style={{ flex: 1 }}>
                <FormContainer>
                  <GenderSwitch>
                    <GenderButton
                      first
                      color={colors.egg}
                      genderColorSelected={getGenderColorSelected(gender)}
                      active={gender === 'Huevo'}
                      onPress={() =>
                        setFieldValue('gender', 'Huevo') &&
                        setBirdData({ ...birdData, gender: 'Huevo' })
                      }>
                      <GenderText
                        color={colors.egg}
                        genderColorSelected={getGenderColorSelected(gender)}
                        active={gender === 'Huevo'}>
                        Huevo
                      </GenderText>
                    </GenderButton>
                    <GenderButton
                      color={colors.male}
                      genderColorSelected={getGenderColorSelected(gender)}
                      active={gender === 'Macho'}
                      onPress={() =>
                        setFieldValue('gender', 'Macho') &&
                        setBirdData({ ...birdData, gender: 'Macho' })
                      }>
                      <GenderText
                        color={colors.male}
                        genderColorSelected={getGenderColorSelected(gender)}
                        active={gender === 'Macho'}>
                        Macho
                      </GenderText>
                    </GenderButton>
                    <GenderButton
                      last
                      color={colors.female}
                      genderColorSelected={getGenderColorSelected(gender)}
                      active={gender === 'Hembra'}
                      onPress={() =>
                        setFieldValue('gender', 'Hembra') &&
                        setBirdData({ ...birdData, gender: 'Hembra' })
                      }>
                      <GenderText
                        color={colors.female}
                        genderColorSelected={getGenderColorSelected(gender)}
                        active={gender === 'Hembra'}>
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
                              {fatherId ? (
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
                                            bird: { id: fatherId },
                                          })
                                        }>
                                        <SelectBirdText father>{fatherId}</SelectBirdText>
                                      </SelectBirdBtn>
                                    </Col>
                                    <Col size={30}>
                                      <SelectBirdBtn
                                        transparent
                                        active
                                        father
                                        onPress={() =>
                                          setFieldValue('fatherId', null) && assignFather(null)
                                        }>
                                        <SelectBirdIcon type="MaterialIcons" name="close" father />
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
                                    navigation.navigate(NavKeys.birdSelectParent, {
                                      currentBird: birdData,
                                      genderToSelect: 'Padre',
                                      assignParent: (globalId, fatherId) =>
                                        setFieldValue('fatherId', globalId) &&
                                        assignFather(fatherId),
                                    })
                                  }>
                                  <SelectBirdIcon type="MaterialIcons" name="add" father />
                                  <SelectBirdText father>Añadir</SelectBirdText>
                                </SelectBirdBtn>
                              )}
                            </Col>
                            <Col style={{ marginLeft: 6 }}>
                              {motherId ? (
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
                                            bird: { id: motherId },
                                          });
                                        }}>
                                        <SelectBirdText mother>{motherId}</SelectBirdText>
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
                                        <SelectBirdIcon type="MaterialIcons" name="close" mother />
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
                                    navigation.navigate(NavKeys.birdSelectParent, {
                                      currentBird: birdData,
                                      genderToSelect: 'Madre',
                                      assignParent: (globalId, motherId) =>
                                        setFieldValue('motherId', globalId) &&
                                        assignMother(motherId),
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
          )}
        </Formik>
      </DetailsContainer>
    </KeyboardAvoidingView>
  );
};

BirdDetails.navigationOptions = ({ navigation }) => {
  const { photo = Constants.defaultAvatar, globalId } = navigation.getParam('bird');
  //const saveBird = navigation.getParam('saveBird');

  return {
    ...NavStyle,
    headerLeft: <Back></Back>,
    headerRight: <HeaderDetailsRight></HeaderDetailsRight>,
    headerBackground: <Image style={{ height: 220 }} source={{ uri: photo }} />,
  };
};

export default withNavigation(BirdDetails);
