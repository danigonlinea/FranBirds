import React, { useEffect, useState } from 'react';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  View,
  Left,
  Thumbnail,
  Right,
} from 'native-base';
import { NavStyle } from '../components';
import { Strings, Colors, Mock } from '../utils';
import { isEmpty } from 'lodash';
import styled, { css } from 'styled-components';

const LineBirdType = styled(View)`
  width: 20px;
  height: 100%;
  background-color: ${props => (props.type === 'Macho' ? Colors.male : Colors.female)};
`;
const TextBird = styled(Text)`
  ${({ colors, fontSize }) => css`
    color: ${colors ? colors : Colors.textPrimary};
    font-size: ${fontSize ? fontSize : 14}px;
  `}
`;

const BirdListScreen = props => {
  const [birds, setBirds] = useState(Mock.birdsData);

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
      <Content padder>
        {birds.map(bird => {
          return (
            <Card key={bird.id}>
              <CardItem>
                <Left>
                  <LineBirdType type={bird.gender} />
                  <Thumbnail
                    source={{
                      uri:
                        'https://cdn3.vectorstock.com/i/1000x1000/50/57/canary-bird-yellow-feather-white-background-vector-8255057.jpg',
                    }}
                  />
                </Left>
                <Body>
                  <TextBird fontSize={16}>{bird.id}</TextBird>
                  {bird.type && <TextBird>{bird.type}</TextBird>}
                  {bird.notes && <TextBird note>{bird.notes}</TextBird>}
                </Body>
                <Right></Right>
              </CardItem>
            </Card>
          );
        })}
      </Content>
    </Container>
  );
};

BirdListScreen.navigationOptions = {
  ...NavStyle,
  headerLeft: undefined,
  headerTitle: 'Birds List',
};

export default BirdListScreen;
