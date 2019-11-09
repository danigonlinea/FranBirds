import { Container, Content, Input, Button, Item, Label, Text, Fab, Icon } from 'native-base';
import React, { useEffect } from 'react';
import { Image, View, TextInput } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled from 'styled-components';
import { Back, HeaderDetailsRight, NavStyle } from '../components';
import { Formik } from 'formik';
import { Colors } from '../utils';

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

const BirdDetails = ({ navigation }) => {
  const id = navigation.getParam('id');

  useEffect(() => {
    console.log('BirdDetails: ', id ? id : 'New Bird');
  }, []);

  return (
    <DetailsContainer>
      <Content>
        <Formik initialValues={{ email: '' }} onSubmit={values => console.log(values)}>
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>
              <Item floatingLabel>
                <Label>Identificador</Label>
                <Input
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </Item>

              {/* <Button onPress={handleSubmit} title="Submit">
                <Text>Submit</Text>
              </Button> */}
            </View>
          )}
        </Formik>
      </Content>
      <View>
        <FabSave
          active
          containerStyle={{}}
          position="bottomRight"
          onPress={() => navigation.navigate(NavKeys.birdDetails)}>
          <FabIcon name="ios-save" />
        </FabSave>
      </View>
    </DetailsContainer>
  );
};

BirdDetails.navigationOptions = ({ navigation }) => {
  const photo = navigation.getParam('photo');
  return {
    ...NavStyle,
    headerLeft: <Back></Back>,
    headerRight: <HeaderDetailsRight></HeaderDetailsRight>,
    headerBackground: <Image style={{ height: 260 }} source={{ uri: photo }} />,
  };
};

export default withNavigation(BirdDetails);
