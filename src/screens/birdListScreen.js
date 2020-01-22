import { isEmpty } from 'lodash';
import {
  Body,
  Card,
  CardItem,
  Col,
  Container,
  Fab,
  Grid,
  Icon,
  Text,
  Thumbnail,
  View,
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import styled, { css } from 'styled-components';
import { NavKeys } from '.';
import { BirdPhotoDialog, Filter, NavStyle, SearchAction, SearchBar } from '../components';
import { useGlobalCtx } from '../context/globalContext';
import { getAllBirds } from '../db';
import { Colors, Strings } from '../utils';
import strings from '../utils/strings';

const LineBirdType = styled(View)`
  width: 10px;
  height: 100px;
  background: ${({ color }) => color};
`;
const TextBird = styled(Text)`
  ${({ color, fontSize }) => css`
    color: ${color ? color : Colors.textPrimary};
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

const CardBird = styled(Card)`
  margin: 8px;
`;

const BirdListScreen = ({ navigation }) => {
  const [allBirds, setAllBirds] = useState([]);
  const [birdsList, setBirdsList] = useState([]);

  const { dataModal, setDataModal, filterSelected, textToSearch } = useGlobalCtx();

  const getBirdListRefreshed = () => {
    getAllBirds(({ result: allBirds }) => {
      setAllBirds(allBirds);
      setBirdsList(allBirds);
    });
  };

  useEffect(() => {
    // Load all Birds from database
    getBirdListRefreshed();
  }, []);

  useEffect(() => {
    if (!isEmpty(allBirds)) {
      filterChange(filterSelected);
    }
  }, [allBirds, filterSelected]);

  const filterChange = filterSelected => {
    switch (filterSelected) {
      case strings.filter.male:
        setBirdsList(allBirds.filter(bird => bird.gender === 'Macho'));
        break;

      case strings.filter.female:
        setBirdsList(allBirds.filter(bird => bird.gender === 'Hembra'));
        break;
      default:
        setBirdsList(allBirds);
        break;
    }
  };

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
      filterChange(filterSelected);
    } else {
      setBirdsList(
        allBirds.filter(
          ({ gender, photo, motherId, fatherId, ...bird }) =>
            gender === filterSelected && isTextSearchFound(bird)
        )
      );
    }
  }, [textToSearch]);

  const getGenderColorSelected = gender => {
    if (gender === 'Macho') {
      return Colors.male;
    } else if (gender === 'Hembra') {
      return Colors.female;
    }

    return Colors.egg;
  };

  const _renderItem = ({ item: bird }) => {
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
                }}>
                <Thumbnail
                  large
                  source={{
                    uri: bird.photo,
                  }}
                />
              </CenterCol>

              <InfoCol
                size={6}
                onPress={() => {
                  navigation.navigate(NavKeys.birdDetails, {
                    bird: { ...bird },
                    refreshBirdList: () => getBirdListRefreshed(),
                  });
                }}>
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
                    bird: { ...bird },
                    refreshBirdList: () => getBirdListRefreshed(),
                  });
                }}>
                <Icon
                  type="MaterialIcons"
                  name="chevron-right"
                  style={{ color: Colors.defaultIcon }}></Icon>
              </CenterCol>
            </Grid>
          </BodyBird>
        </CardItemBird>
      </CardBird>
    );
  };

  return (
    <Container>
      <BirdPhotoDialog />
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
      <View>
        <FabPlus
          active
          containerStyle={{}}
          position="bottomRight"
          onPress={() =>
            navigation.navigate(NavKeys.birdDetails, {
              bird: { gender: 'Macho' },
              refreshBirdList: () => getBirdListRefreshed(),
            })
          }>
          <Icon type="MaterialIcons" name="add" />
        </FabPlus>
      </View>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: () => null,
  headerTitle: () => <Filter></Filter>,
  headerRight: () => <SearchAction></SearchAction>,
};

export default withNavigation(BirdListScreen);
