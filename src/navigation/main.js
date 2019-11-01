import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { NavKeys, BirdList, BirdDetails } from '../screens';

const MainNavigator = createStackNavigator(
  {
    [NavKeys.birdList]: { screen: BirdList },
    [NavKeys.birdDetails]: { screen: BirdDetails },
  },
  {
    initialRouteName: NavKeys.birdList,
  }
);

const App = createAppContainer(MainNavigator);

export default App;
