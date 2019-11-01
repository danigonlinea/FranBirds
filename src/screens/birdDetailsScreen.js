import React, { useEffect, useState } from 'react';
import { Container, Text } from 'native-base';

const BirdDetails = props => {
  useEffect(() => {
    console.log('BirdDetails');
  }, []);

  return (
    <Container>
      <Text>Bird Details</Text>
    </Container>
  );
};

export default BirdDetails;
