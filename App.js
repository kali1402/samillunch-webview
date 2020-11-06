import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import * as Notifications from 'expo-notifications'
import * as Permissions from 'expo-permissions';

const PUSH_REGISTRATION_ENDPOINT = "https://gvn8elh9kk.execute-api.ap-northeast-2.amazonaws.com/v1/token";
const MESSAGE_ENPOINT = "https://gvn8elh9kk.execute-api.ap-northeast-2.amazonaws.com/v1/message";

export default function App() {
  const [state, setState] = useState({
    Notifications: null,
    messageText: "",
  });

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

    if (status !== "granted") {
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    return axios.post(PUSH_REGISTRATION_ENDPOINT, {
      token: {
        value: token.data,
      },
      user: {
        username: "kali",
        name: "pushapp",
      },
    });

    const notificationSubscription = Notifications.addListener(handleNotification);
  };

  const handleNotification = (notification) => {
    setState({ notification });
  };

  const handleChangeText = (text) => {
    setState({ messageText: text });
  };

  const sendMessage = async (message) => {
    axios.post(MESSAGE_ENPOINT, {
      message
    });
    setState({ messageText: "" });
  };

  const getLunch = async () => {
    const data = await axios.get('https://gvn8elh9kk.execute-api.ap-northeast-2.amazonaws.com/v1');
    const res = data.data.join(", ");
    sendMessage(res);
  }

  useEffect(() => {
    getLunch();
    registerForPushNotificationsAsync();
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        source={{ uri: 'http://www.samil.hs.kr/main.php' }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});