import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NavKeys, BirdDetails } from '../screens';
import birdListScreen from '../screens/birdListScreen';

const MainNavigator = createStackNavigator(
  {
    [NavKeys.birdList]: { screen: birdListScreen },
    [NavKeys.birdDetails]: { screen: BirdDetails },
  },
  {
    initialRouteName: NavKeys.birdList,
  }
);

const App = createAppContainer(MainNavigator);

export default App;
