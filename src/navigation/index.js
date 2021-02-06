import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavKeys } from '../screens';
import birdListScreen from '../screens/birdListScreen';
import birdDetailsScreen from '../screens/birdDetailsScreen';
import birdSelectParentScreen from '../screens/birdSelectParentScreen';
import BirdCameraScreen from '../screens/birdCameraScreen';
import birdNewParent from '../screens/birdNewParent';
import JailList from '../screens/jailList';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function BirdStack() {
  return (
    <Stack.Navigator initialRouteName={NavKeys.birdList}>
      <Stack.Screen name={NavKeys.birdList} component={birdListScreen} />
      <Stack.Screen name={NavKeys.birdDetails} component={birdDetailsScreen} />
      <Stack.Screen name={NavKeys.birdSelectParent} component={birdSelectParentScreen} />
      <Stack.Screen name={NavKeys.birdNewParent} component={birdNewParent} />
      <Stack.Screen name={NavKeys.birdCamera} component={BirdCameraScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Birds">
        <Drawer.Screen name="Birds" component={BirdStack} />
        <Drawer.Screen name="Jails" component={JailList} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
