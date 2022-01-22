import * as React from 'react';
import { Text } from 'react-native';
import Tab1 from './screens/Tab1';
import Tab2 from './screens/Tab2';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export default function JokePost({ navigation }) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tab1"
        component={Tab1}
        options={{ tabBarIcon: () => <Text>👧</Text> }}
      />
      <Tab.Screen
        name="Tab2"
        component={Tab2}
        options={{ tabBarIcon: () => <Text>👦</Text> }}
      />
    </Tab.Navigator>
  );
}
