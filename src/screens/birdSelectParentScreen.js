import { Body, Card, CardItem, Col, Container, Grid, Text, Thumbnail, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled, { css } from 'styled-components';
import { NavStyle, SearchAction, SearchBar } from '../components';
import { useGlobalCtx } from '../context/globalContext';
import { getBirdsForSelectAsParent, searchBirdsByGender } from '../db';
import { Colors } from '../utils';
import { getDefaultAvatar } from '../utils/functions';

const HeaderText = styled(Text)`
  color: ${Colors.white};
`;
const TextBird = styled(Text)`
  ${({ colors, fontSize }) => css`
    color: ${colors || Colors.textPrimary};
    font-size: ${fontSize || 14}px;
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
  const { textToSearch, showSearchBar } = useGlobalCtx();

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

  useEffect(() => {
    console.log('Hey', textToSearch, genderToAssign, currentBird);
    searchBirdsByGender(
      textToSearch,
      genderToAssign,
      currentBird.globalId,
      ({ result: birdsMatched }) => {
        setBirdsList(birdsMatched);
      },
      (ts, error) => console.log('Error', error)
    );
  }, [textToSearch]);

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
                <TextBird>{`${bird.gender}${bird.type ? `/${bird.type}` : ''}`}</TextBird>
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

  return (
    <Container>
      {!showSearchBar && (
        <CurrentBirdContainer color={getGenderColorSelected(genderToAssign)}>
          <Grid>
            <CenterCol size={3}>
              <Thumbnail
                source={{
                  uri: photo || getDefaultAvatar(gender),
                }}
              />
            </CenterCol>

            <InfoCol size={6}>
              <TextBird colors={Colors.textSecundary} fontSize={16}>
                {id}
              </TextBird>
              <TextBird colors={Colors.textSecundary}>
                {`${gender}${type ? `/${type}` : ''}`}
              </TextBird>
              <TextBird colors={Colors.textSecundary} ellipsizeMode="tail" note numberOfLines={1}>
                {notes}
              </TextBird>
            </InfoCol>
          </Grid>
        </CurrentBirdContainer>
      )}

      <SearchBar />

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
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              <Text>
                No hay ningún pájaro {genderToAssign} para asignar como {genderType}, regístrelos
                primero.
              </Text>
            </View>
          </Container>
        }
      />
    </Container>
  );
};

const getGenderColorSelected = gender => {
  if (gender === 'Macho') {
    return Colors.male;
  }
  if (gender === 'Hembra') {
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
    headerRight: () => <SearchAction iconColor={Colors.textSecundary} />,
  };
};

export default withNavigation(BirdSelectParent);
