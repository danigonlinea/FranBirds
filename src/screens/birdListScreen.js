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
import { NavStyle, BirdPhotoDialog, Filter } from '../components';
import { Colors, Mock, Strings, Constants } from '../utils';
import { withNavigation } from 'react-navigation';
import { NavKeys } from '.';
import { FlatList } from 'react-native';
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

const BirdListScreen = ({ navigation }) => {
  const [allBirds, setAllBirds] = useState([]);
  const [birdsList, setBirdsList] = useState([]);

  const { dataModal, setDataModal, filterSelected } = useGlobalCtx();

  useEffect(() => {
    // Load all Birds from database
    setAllBirds(Mock.birdsData);
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

  const _renderItem = ({ item: bird }) => {
    return (
      <Card key={bird.id}>
        <CardItemBird>
          <BodyBird>
            <Grid>
              <Col size={0.5}>
                <LineBirdType type={bird.gender} />
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
                onPress={() => navigation.navigate(NavKeys.birdDetails, { bird: { ...bird } })}>
                <TextBird fontSize={16}>{bird.id}</TextBird>
                {bird.type && <TextBird>{bird.type}</TextBird>}
                {bird.notes && <TextBird note>{bird.notes}</TextBird>}
              </InfoCol>
              <CenterCol
                size={1}
                onPress={() => navigation.navigate(NavKeys.birdDetails, { bird: { ...bird } })}>
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
      <BirdPhotoDialog />
      <Content padder>
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
      </Content>
      <View>
        <FabPlus
          active
          containerStyle={{}}
          position="bottomRight"
          onPress={() => navigation.navigate(NavKeys.birdDetails, { bird: { gender: 'Macho' } })}>
          <Icon type="MaterialIcons" name="add" />
        </FabPlus>
      </View>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: undefined,
  headerTitle: <Filter></Filter>,
};

export default withNavigation(BirdListScreen);
