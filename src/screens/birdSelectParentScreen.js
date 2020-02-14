import { isEmpty } from 'lodash';
import {
  Body,
  Card,
  CardItem,
  Container,
  Content,
  Icon,
  Text,
  Thumbnail,
  View,
  Grid,
  Col,
  Fab,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { NavStyle, BirdPhotoDialog, Filter, SearchAction, SearchBar } from '../components';
import { Colors, Mock, Strings, Constants } from '../utils';
import { withNavigation } from 'react-navigation';
import { NavKeys } from '.';
import { FlatList, Alert } from 'react-native';
import GlobalContext, { useGlobalCtx } from '../context/globalContext';
import strings from '../utils/strings';
import { getBirdsForSelectAsParent } from '../db';
import { getDefaultAvatar } from '../utils/functions';

const HeaderText = styled(Text)`
  color: ${Colors.white};
`;
const TextBird = styled(Text)`
  ${({ colors, fontSize }) => css`
    color: ${colors ? colors : Colors.textPrimary};
    font-size: ${fontSize ? fontSize : 14}px;
  `}
`;

const CardItemBird = styled(CardItem)`
  padding: 0;
`;

const CenterCol = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BodyBird = styled(Body)``;

const InfoCol = styled(Col)`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const CurrentBirdContainer = styled(View)`
  height: 90px;
  background-color: ${({ color }) => color};
`;

const BirdSelectParent = ({ navigation }) => {
  const currentBird = navigation.getParam('currentBird');
  const genderType = navigation.getParam('parentType');
  const genderToAssign = navigation.getParam('genderToAssign');
  const assignParent = navigation.getParam('assignParent');

  const [birdsList, setBirdsList] = useState([]);
  const { textToSearch } = useGlobalCtx();

  const { photo, id, type, notes, gender, globalId } = currentBird;

  const getBirdsAndUpdate = () => {
    console.log(genderToAssign, globalId);
    getBirdsForSelectAsParent(
      genderToAssign,
      globalId,
      ({ result: birdsMatched }) => {
        setBirdsList(birdsMatched);
      },
      (ts, error) => console.log('Error', error)
    );
  };

  useEffect(() => {
    getBirdsAndUpdate();
  }, []);

  const assigningParent = (globalId, birdId) => {
    Alert.alert(
      `Asignar ${genderType}`,
      `¿Quieres asignar este pájaro (ID: ${birdId}) como ${genderType}?`,
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Si',
          onPress: () => {
            assignParent(globalId, birdId);
            navigation.goBack(null);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const _renderItem = ({ item: bird }) => {
    return (
      <Card key={bird.id}>
        <CardItemBird>
          <BodyBird>
            <Grid>
              <CenterCol size={3}>
                <Thumbnail
                  large
                  source={{
                    uri: bird.photo ? bird.photo : getDefaultAvatar(bird.gender),
                  }}
                />
              </CenterCol>

              <InfoCol size={6} onPress={() => assigningParent(bird.globalId, bird.id)}>
                <TextBird fontSize={16}>{bird.id}</TextBird>
                <TextBird>{`${bird.gender}${bird.type ? '/' + bird.type : ''}`}</TextBird>
                <TextBird ellipsizeMode="tail" note numberOfLines={1}>
                  {bird.notes}
                </TextBird>
              </InfoCol>
            </Grid>
          </BodyBird>
        </CardItemBird>
      </Card>
    );
  };

  console.log(currentBird);

  return (
    <Container>
      <CurrentBirdContainer color={getGenderColorSelected(genderToAssign)}>
        <Grid>
          <CenterCol size={3}>
            <Thumbnail
              source={{
                uri: photo ? photo : getDefaultAvatar(gender),
              }}
            />
          </CenterCol>

          <InfoCol size={6}>
            <TextBird colors={Colors.textSecundary} fontSize={16}>
              {id}
            </TextBird>
            <TextBird colors={Colors.textSecundary}>{`${gender}${
              type ? '/' + type : ''
            }`}</TextBird>
            <TextBird colors={Colors.textSecundary} ellipsizeMode="tail" note numberOfLines={1}>
              {notes}
            </TextBird>
          </InfoCol>
        </Grid>
      </CurrentBirdContainer>
      <SearchBar></SearchBar>

      <FlatList
        enableAutomaticScroll
        enableOnAndroid
        scrollEnabled
        key={birdsList.length}
        data={birdsList}
        renderItem={_renderItem}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={
          <Container>
            <Text>{Strings.noBirdsRegistered}</Text>
          </Container>
        }
      />
    </Container>
  );
};

const getGenderColorSelected = gender => {
  if (gender === 'Macho') {
    return Colors.male;
  } else if (gender === 'Hembra') {
    return Colors.female;
  }

  return Colors.egg;
};

BirdSelectParent.navigationOptions = ({ navigation }) => {
  const parentType = navigation.getParam('parentType');
  const genderToAssign = navigation.getParam('genderToAssign');

  return {
    ...NavStyle,
    headerStyle: {
      backgroundColor: getGenderColorSelected(genderToAssign),
    },
    headerTitleStyle: {
      color: Colors.textSecundary,
    },
    headerLeft: () => null,
    headerTitle: () => <HeaderText>{`Selecciona para asignar ${parentType}`}</HeaderText>,
    headerRight: () => <SearchAction iconColor={Colors.textSecundary}></SearchAction>,
  };
};

export default withNavigation(BirdSelectParent);
