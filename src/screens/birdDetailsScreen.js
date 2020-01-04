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
import { Formik } from 'formik';
import { Colors, Constants } from '../utils';
import * as Yup from 'yup';
import { NavKeys } from '.';
import { useGlobalCtx } from '../context/globalContext';
import { insertBird } from '../db';

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
  padding: 24px;
`;

const birdFormValues = bird => {
  return bird.id
    ? { ...bird }
    : {
        id: undefined,
        type: undefined,
        notes: undefined,
        gender: 'Macho',
        photo: Constants.defaultAvatar,
        fatherId: undefined,
        motherId: undefined,
      };
};

const FormItem = styled(Item)`
  margin: 0 8px 16px 8px;
`;

const GenderSwitch = styled(Segment)``;
// border-color: ${props.active ? (props.first ? Colors.male : Colors.female) : Colors.female};
const GenderButton = styled(Button)(
  props => css`
    border-color: ${props.active
      ? props.first
        ? Colors.male
        : Colors.female
      : props.first
      ? Colors.female
      : Colors.male};
    background-color: ${props.active ? (props.first ? Colors.male : Colors.female) : Colors.white};
  `
);

const GenderText = styled(Text)(
  props => css`
    color: ${props.active ? Colors.white : props.first ? Colors.female : Colors.male};
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

const birdValidationSchema = () => {
  return Yup.object().shape({
    id: Yup.string().required('El Identificador es necesario'),
    type: Yup.string(),
    notes: Yup.string(),
    gender: Yup.string(),
    photo: Yup.string(),
    fatherId: Yup.string(),
    motherId: Yup.string(),
  });
};

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

const BirdDetails = ({ navigation }) => {
  const [birdData, setBirdData] = useState(navigation.getParam('bird'));
  const [fatherId, setFather] = useState(birdData.fatherId || false);
  const [motherId, setMother] = useState(birdData.motherId || false);

  const { dataModal, setDataModal } = useGlobalCtx();

  const assignFather = fatherId => {
    setFather(fatherId);
  };

  const assignMother = motherId => {
    setMother(motherId);
  };

  const { id, type, notes, gender, photo } = birdData;

  const insertBirdSuccess = success => {
    console.log('Success', success);
  };

  const insertBirdFailure = error => {
    console.log('Error', error);
  };

  const submitBird = birdData => {
    console.log(birdData);
    insertBird(birdData, insertBirdSuccess, insertBirdFailure);
  };

  return (
    <DetailsContainer>
      <Formik
        initialValues={birdFormValues(birdData)}
        validationSchema={birdValidationSchema()}
        onSubmit={submitBird}>
        {({ handleChange, handleBlur, handleSubmit, touched, values, errors }) => (
          <>
            <Content style={{ flex: 1 }}>
              <FormContainer>
                <KeyboardAvoidingView keyboardVerticalOffset={180} behavior="height" enabled>
                  <ScrollView>
                    <GenderSwitch>
                      <GenderButton
                        first
                        active={gender === 'Macho'}
                        onPress={() => setBirdData({ ...birdData, gender: 'Macho' })}>
                        <GenderText first active={gender === 'Macho'}>
                          Macho
                        </GenderText>
                      </GenderButton>
                      <GenderButton
                        last
                        active={gender === 'Hembra'}
                        onPress={() => setBirdData({ ...birdData, gender: 'Hembra' })}>
                        <GenderText last active={gender === 'Hembra'}>
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
                                          rounded
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
                                          onPress={() => assignFather(undefined)}>
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
                                      navigation.navigate(NavKeys.birdSelectParent, {
                                        currentBird: birdData,
                                        genderToSelect: 'Padre',
                                        assignParent: fatherId => assignFather(fatherId),
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
                                          onPress={() => assignMother(undefined)}>
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
                                      navigation.navigate(NavKeys.birdSelectParent, {
                                        currentBird: birdData,
                                        genderToSelect: 'Madre',
                                        assignParent: motherId => assignMother(motherId),
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
                                onChangeText={handleChange('notes')}
                                onBlur={handleBlur('notes')}
                                value={values.notes}
                              />
                            </FormItem>
                          </Row>
                        </Grid>
                      </CardItem>
                    </Card>
                  </ScrollView>
                </KeyboardAvoidingView>
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
  );
};

BirdDetails.navigationOptions = ({ navigation }) => {
  const { photo = Constants.defaultAvatar } = navigation.getParam('bird');
  return {
    ...NavStyle,
    headerLeft: <Back></Back>,
    headerRight: <HeaderDetailsRight></HeaderDetailsRight>,
    headerBackground: <Image style={{ height: 220 }} source={{ uri: photo }} />,
  };
};

export default withNavigation(BirdDetails);
