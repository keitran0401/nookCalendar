import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import * as Notifications from 'expo-notifications';
import axios from 'axios';
import JokePost from './src/JokePost';
import { LogBox } from 'react-native';
import styled from 'styled-components';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Drawer = createDrawerNavigator();
const JOKE_URL = 'https://v2.jokeapi.dev/joke/Any';
const EXPO_SERVER_URL = 'https://exp.host/--/api/v2/push/send'; //https://api.expo.dev/v2/push/send

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Show me a Joke"
        onPress={async () => {
          const randomJoke = (await axios.get(JOKE_URL)).data;
          const pushToken = await registerForPushNotificationsAsync();

          if (pushToken && randomJoke) {
            const message = {
              to: pushToken,
              sound: 'default',
              title: 'Joke of the day',
              body: randomJoke.setup,
              data: randomJoke,
            };

            await axios.post(EXPO_SERVER_URL, message);
          }
        }}
      />
    </DrawerContentScrollView>
  );
}

async function registerForPushNotificationsAsync() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

const Page = styled(View)`
  padding: 40px 30px 0 30px;
`;
const Heading = styled(Text)`
  text-align: center;
  font-size: 20px;
  margin-bottom: 16px;
  font-weight: bold;
`;

export default function App() {
  const [noti, setNoti] = React.useState(null);
  const [isNotiClicked, setIsNotiClicked] = React.useState(false);

  React.useEffect(() => {
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token))
    const subA = Notifications.addNotificationReceivedListener((notification) =>
      setNoti(notification)
    );

    const subB = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    const receivedMessage =
      Notifications.addNotificationResponseReceivedListener((response) =>
        setIsNotiClicked(true)
      );

    return () => {
      Notifications.removeNotificationSubscription(subA);
      Notifications.removeNotificationSubscription(subB);
      Notifications.removeNotificationSubscription(receivedMessage);
    };
  }, []);

  if (isNotiClicked && noti) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Page>
          <Heading>{noti.request.content.data.delivery}</Heading>
        </Page>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer style={styles.container}>
        <Drawer.Navigator
          initialRouteName="Show me a Joke"
          drawerContent={CustomDrawerContent}
        >
          <Drawer.Screen name="Joke Home" component={JokePost} />
        </Drawer.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
