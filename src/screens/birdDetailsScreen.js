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
import { Back, HeaderDetailsRight, NavStyle } from '../components';
import { Formik } from 'formik';
import { Colors, Constants } from '../utils';
import * as Yup from 'yup';
import { NavKeys } from '.';

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
  return bird
    ? { ...bird }
    : {
        id: undefined,
        type: undefined,
        notes: undefined,
        gender: 'Macho',
        photo: Constants.defaultAvatar,
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
    id: Yup.string().required('Identificator is required'),
    type: Yup.string(),
    notes: Yup.string(),
    gender: Yup.string(),
    photo: Yup.string(),
  });
};

const BirdDetails = ({ navigation }) => {
  const [birdData, setBirdData] = useState(navigation.getParam('bird'));

  useEffect(() => {
    console.log('BirdData: ', birdData);
  }, [birdData]);

  const { id, type, notes, gender, photo } = birdData;

  return (
    <DetailsContainer>
      <Formik
        initialValues={birdFormValues(birdData)}
        validationSchema={birdValidationSchema()}
        onSubmit={values => console.log(values)}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
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
                          <Row>
                            <Col>
                              <FormItem stackedLabel>
                                <Label>Padre</Label>
                                <SelectBirdBtn
                                  bordered
                                  iconLeft
                                  rounded
                                  active
                                  father
                                  onPress={() =>
                                    navigation.navigate(NavKeys.birdSelectParent, {
                                      bird: birdData,
                                      genderToSelect: 'Padre',
                                    })
                                  }>
                                  <SelectBirdIcon type="MaterialIcons" name="add" father />
                                  <SelectBirdText father>Añadir</SelectBirdText>
                                </SelectBirdBtn>
                              </FormItem>
                            </Col>
                            <Col>
                              <FormItem stackedLabel>
                                <Label>Madre</Label>
                                <SelectBirdBtn
                                  bordered
                                  iconLeft
                                  rounded
                                  active
                                  mother
                                  onPress={() =>
                                    navigation.navigate(NavKeys.birdSelectParent, {
                                      bird: birdData,
                                      genderToSelect: 'Madre',
                                    })
                                  }>
                                  <SelectBirdIcon type="MaterialIcons" name="add" mother />
                                  <SelectBirdText mother>Añadir</SelectBirdText>
                                </SelectBirdBtn>
                              </FormItem>
                            </Col>
                          </Row>
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
              <FabSave
                active
                containerStyle={{}}
                position="bottomRight"
                onPress={() => handleSubmit()}>
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
