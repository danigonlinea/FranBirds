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
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { Image, View, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled, { css } from 'styled-components';
import { Back, HeaderDetailsRight, NavStyle } from '../components';
import { Formik } from 'formik';
import { Colors, Constants } from '../utils';
import * as Yup from 'yup';
import { kMaxLength } from 'buffer';

const DetailsContainer = styled(Container)`
  margin-top: 180px;
`;

const FabSave = styled(Fab)`
  background-color: ${Colors.fabSave};
`;

const FabIcon = styled(Icon)`
  font-size: 28px;
  color: ${Colors.white};
`;

const FormContainer = styled(View)`
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
  margin-bottom: 16px;
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

const VerticalSpace = styled(View)`
  padding: 12px;
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

  console.log(birdData);

  return (
    <DetailsContainer>
      <Formik
        initialValues={birdFormValues(birdData)}
        validationSchema={birdValidationSchema()}
        onSubmit={values => console.log(values)}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <>
            <Content padder>
              <FormContainer>
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

                <FormItem floatingLabel>
                  <Label>Identificador</Label>
                  <Input
                    onChangeText={handleChange('id')}
                    onBlur={handleBlur('id')}
                    value={values.id}
                  />
                </FormItem>
                <FormItem floatingLabel>
                  <Label>Tipo</Label>
                  <Input
                    onChangeText={handleChange('type')}
                    onBlur={handleBlur('type')}
                    value={values.type}
                  />
                </FormItem>

                <FormItem floatingLabel>
                  <Label>Notas</Label>
                  <Input
                    numberOfLines={3}
                    onChangeText={handleChange('notes')}
                    onBlur={handleBlur('notes')}
                    value={values.notes}
                  />
                </FormItem>
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
    headerBackground: <Image style={{ height: 260 }} source={{ uri: photo }} />,
  };
};

export default withNavigation(BirdDetails);
