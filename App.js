// eslint-disable-next-line import/no-extraneous-dependencies
import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { Container } from 'native-base';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import GlobalContext from './src/context/globalContext';
import { createDatabase } from './src/db';
import { AppNavigation } from './src/navigation';
import RobotoRegular from './assets/fonts/Roboto-Regular.ttf';
import RobotoMedium from './assets/fonts/Roboto-Medium.ttf';

const GlobalContainer = styled(Container)`
  font-family: 'Roboto';
`;

const App = () => {
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Roboto: RobotoRegular,
        Roboto_medium: RobotoMedium,
        ...Ionicons.font,
      });
    }

    if (!isReady) {
      loadFonts();

      createDatabase();
      setReady(true);
    }
  }, [isReady]);

  if (!isReady) {
    return <AppLoading />;
  }

  return (
    <GlobalContainer>
      <GlobalContext>
        <AppNavigation />
      </GlobalContext>
    </GlobalContainer>
  );
};

export default App;
