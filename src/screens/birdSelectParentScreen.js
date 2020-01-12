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

const LineBirdType = styled(View)`
  width: 10px;
  height: 100px;
  background: ${props => (props.type === 'Macho' ? Colors.male : Colors.female)};
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

const FabPlus = styled(Fab)`
  background-color: ${Colors.secondary};
`;

const CurrentBirdContainer = styled(View)`
  height: 90px;
  background-color: ${Colors.primary};
`;

const BirdSelectParent = ({ navigation }) => {
  const currentBird = navigation.getParam('currentBird');
  const genderToSelect = navigation.getParam('genderToSelect');
  const assignParent = navigation.getParam('assignParent');

  const [allBirds, setAllBirds] = useState([]);
  const [birdsList, setBirdsList] = useState([]);

  const { textToSearch } = useGlobalCtx();

  useEffect(() => {
    // Load all Birds from database
    if (genderToSelect === strings.filter.male) {
      // All Males
      setAllBirds(Mock.birdsData);
    } else {
      // All Females
      setAllBirds(Mock.birdsData);
    }
  }, []);

  // Only search on id, type and notes
  const isTextSearchFound = bird => {
    const allWordsToSearch = textToSearch.split(' ');
    return Object.values(bird).some(fieldValue => {
      return allWordsToSearch.some(singleTextToSearch => {
        return fieldValue.toLowerCase().includes(singleTextToSearch.toLowerCase());
      });
    });
  };

  useEffect(() => {
    if (!textToSearch) {
      // All List
      setBirdsList(Mock.birdsData);
    } else {
      setBirdsList(
        allBirds.filter(({ gender, photo, motherId, fatherId, ...bird }) => isTextSearchFound(bird))
      );
    }
  }, [textToSearch]);

  const assigningParent = (globalId, birdId) => {
    Alert.alert(
      `Asignar ${genderToSelect}`,
      `¿Quieres asignar este pájaro (${birdId}) como ${genderToSelect}?`,
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
                    uri: bird.photo,
                  }}
                />
              </CenterCol>

              <InfoCol size={6} onPress={() => assigningParent(bird.globalId, bird.id)}>
                <TextBird fontSize={16}>{bird.id}</TextBird>
                {bird.type && <TextBird>{bird.type}</TextBird>}
                {bird.notes && <TextBird note>{bird.notes}</TextBird>}
              </InfoCol>
              <CenterCol size={1} onPress={() => assigningParent(bird.globalId, bird.id)}>
                <Icon
                  type="MaterialIcons"
                  name="chevron-right"
                  style={{ color: Colors.defaultIcon }}></Icon>
              </CenterCol>
            </Grid>
          </BodyBird>
        </CardItemBird>
      </Card>
    );
  };

  return (
    <Container>
      <CurrentBirdContainer>
        <Grid>
          <CenterCol size={3}>
            <Thumbnail
              source={{
                uri: currentBird.photo,
              }}
            />
          </CenterCol>

          <InfoCol size={6}>
            <TextBird fontSize={16}>{currentBird.id}</TextBird>
            {currentBird.type && <TextBird>{currentBird.type}</TextBird>}
            {currentBird.notes && <TextBird note>{currentBird.notes}</TextBird>}
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

BirdSelectParent.navigationOptions = ({ navigation }) => {
  const genderToSelect = navigation.getParam('genderToSelect');

  return {
    ...NavStyle,
    headerLeft: undefined,
    headerTitle: `Seleccionar ${genderToSelect}`,
    headerRight: <SearchAction></SearchAction>,
  };
};

export default withNavigation(BirdSelectParent);
