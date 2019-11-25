import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NavKeys } from '../screens';
import birdListScreen from '../screens/birdListScreen';
import birdDetailsScreen from '../screens/birdDetailsScreen';
import birdSelectParentScreen from '../screens/birdSelectParentScreen';

const MainNavigator = createStackNavigator(
  {
    [NavKeys.birdList]: { screen: birdListScreen },
    [NavKeys.birdDetails]: { screen: birdDetailsScreen },
    [NavKeys.birdSelectParent]: { screen: birdSelectParentScreen },
  },
  {
    initialRouteName: NavKeys.birdList,
  }
);

const App = createAppContainer(MainNavigator);

export default App;
