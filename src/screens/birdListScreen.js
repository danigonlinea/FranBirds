import {
  Body,
  Card,
  CardItem,
  Col,
  Container,
  Fab,
  Grid,
  Icon,
  Spinner,
  Text,
  Thumbnail,
  View,
} from 'native-base';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import styled, { css } from 'styled-components';
import { NavKeys } from '.';
import { BirdPhotoDialog, Filter, NavStyle, SearchAction, SearchBar } from '../components';
import { useGlobalCtx } from '../context/globalContext';
import { getBirds, searchBirds } from '../db';
import { Colors, Strings } from '../utils';
import { getDefaultAvatar } from '../utils/functions';
import strings from '../utils/strings';

const LineBirdType = styled(View)`
  width: 10px;
  height: 100px;
  background: ${({ color }) => color};
`;
const TextBird = styled(Text)`
  ${({ color, fontSize }) => css`
    color: ${color || Colors.textPrimary};
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

const FabPlus = styled(Fab)`
  background-color: ${Colors.secondary};
`;

const CardBird = styled(Card)`
  margin: 8px;
`;

const BirdListScreen = () => {
  const navigation = useNavigation();
  const [birdsList, setBirdsList] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);

  const { dataModal, setDataModal, filterSelected, setFilter, textToSearch } = useGlobalCtx();

  const getBirdsAndUpdate = useCallback(() => {
    getBirds(
      strings.gender[filterSelected],
      ({ result: birdsMatched }) => {
        setBirdsList(birdsMatched);

        if (!firstLoad) {
          setFirstLoad(true);
        }
      },
      (ts, error) => console.log('Error', error)
    );
  }, [filterSelected, firstLoad]);

  const getBirdListRefreshed = () => {
    if (filterSelected) {
      setFilter(0);
    } else {
      getBirdsAndUpdate();
    }
  };

  useEffect(() => {
    getBirdsAndUpdate();
  }, [filterSelected, getBirdsAndUpdate]);

  useEffect(() => {
    searchBirds(
      textToSearch,
      ({ result: birdsMatched }) => {
        setBirdsList(birdsMatched);
      },
      (ts, error) => console.log('Error', error)
    );
  }, [textToSearch]);

  const getGenderColorSelected = (gender) => {
    if (gender === 'Macho') {
      return Colors.male;
    }
    if (gender === 'Hembra') {
      return Colors.female;
    }

    return Colors.egg;
  };

  const renderItemForFlatList = ({ item: bird }) => {
    return (
      <CardBird key={bird.id}>
        <CardItemBird>
          <BodyBird>
            <Grid>
              <Col size={0.5}>
                <LineBirdType color={getGenderColorSelected(bird.gender)} />
              </Col>
              <CenterCol
                size={3}
                onPress={() => {
                  setDataModal({
                    bird,
                    toggleDialog: !dataModal.toggleDialog,
                  });
                }}
              >
                <Thumbnail
                  large
                  source={{
                    uri: bird.photo ? bird.photo : getDefaultAvatar(bird.gender),
                  }}
                />
              </CenterCol>

              <InfoCol
                size={6}
                onPress={() => {
                  navigation.navigate(NavKeys.birdDetails, {
                    birdGlobalId: bird.globalId,
                    refreshBirdList: () => getBirdListRefreshed(),
                  });
                }}
              >
                <TextBird fontSize={16}>{bird.id}</TextBird>
                <TextBird>{bird.type}</TextBird>
                <TextBird ellipsizeMode="tail" note numberOfLines={1}>
                  {bird.notes}
                </TextBird>
              </InfoCol>
              <CenterCol
                size={1}
                onPress={() => {
                  navigation.navigate(NavKeys.birdDetails, {
                    birdGlobalId: bird.globalId,
                    refreshBirdList: () => getBirdListRefreshed(),
                  });
                }}
              >
                <Icon
                  type="MaterialIcons"
                  name="chevron-right"
                  style={{ color: Colors.defaultIcon }}
                />
              </CenterCol>
            </Grid>
          </BodyBird>
        </CardItemBird>
      </CardBird>
    );
  };

  const renderEmptyList = () => {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>{Strings.noBirdsRegistered}</Text>
        </View>
      </Container>
    );
  };

  if (!firstLoad) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner color={Colors.primary} />
          <Text>Cargando pájaros...</Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <BirdPhotoDialog />
      <SearchBar />

      <FlatList
        enableAutomaticScroll
        enableOnAndroid
        scrollEnabled
        key={birdsList.length}
        data={birdsList}
        renderItem={renderItemForFlatList}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={renderEmptyList}
      />
      <View>
        <FabPlus
          active
          containerStyle={{}}
          position="bottomRight"
          onPress={() => navigation.navigate(NavKeys.birdDetails, {
            bird: { gender: 'Macho' },
            refreshBirdList: () => getBirdListRefreshed(),
          })}
        >
          <Icon type="MaterialIcons" name="add" />
        </FabPlus>
      </View>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: () => null,
  headerTitle: () => <Filter />,
  headerRight: () => <SearchAction iconColor={Colors.textPrimary} />,
};

export default BirdListScreen;
