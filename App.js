import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from './src/Home';
import ImageEdit from './src/ImageEdit';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ImageEdit"
          component={ImageEdit}
          options={{
            title: 'ImageEdit',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        />
        {/* <Stack.Screen
          name="OCR"
          component={OCR}
          options={{
            title: 'OCR',
            headerStyle: {
              backgroundColor: '#2288ee',
            },
            headerTintColor: '#fff',
          }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};


