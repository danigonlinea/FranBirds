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
import { NavStyle, BirdPhotoDialog } from '../components';
import { Colors, Mock, Strings, Constants } from '../utils';
import { withNavigation } from 'react-navigation';
import { NavKeys } from '.';
import GlobalContext, { useGlobalCtx } from '../context/globalContext';

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
  const [birds, setBirds] = useState(Mock.birdsData);

  const { dataModal, setDataModal } = useGlobalCtx();

  useEffect(() => {
    console.log('BirdDetails');
  }, []);

  if (Array.isArray(birds) && isEmpty(birds)) {
    return (
      <Container>
        <Text>{Strings.noBirdsRegistered}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <BirdPhotoDialog />
      <Content padder>
        {birds.map(bird => {
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
                      onPress={() => navigation.navigate(NavKeys.birdDetails, { id: bird.id })}>
                      <TextBird fontSize={16}>{bird.id}</TextBird>
                      {bird.type && <TextBird>{bird.type}</TextBird>}
                      {bird.notes && <TextBird note>{bird.notes}</TextBird>}
                    </InfoCol>
                    <CenterCol
                      size={1}
                      onPress={() => navigation.navigate(NavKeys.birdDetails, { id: bird.id })}>
                      <Icon
                        type="Entypo"
                        name="chevron-right"
                        style={{ color: Colors.defaultIcon }}></Icon>
                    </CenterCol>
                  </Grid>
                </BodyBird>
              </CardItemBird>
            </Card>
          );
        })}
      </Content>
      <View>
        <FabPlus
          active
          containerStyle={{}}
          position="bottomRight"
          onPress={() => navigation.navigate(NavKeys.birdDetails)}>
          <Icon type="Entypo" name="plus" />
        </FabPlus>
      </View>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: undefined,
  headerTitle: 'Birds List',
};

export default withNavigation(BirdListScreen);
