import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const PUSH_REGISTRATION_ENDPOINT = "http://a1224a3424da.ngrok.io/token";
const MESSAGE_ENPOINT = "http://a1224a3424da.ngrok.io/message";

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
        value: token,
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

  useEffect(() => {
    axios.get('http://smaillunch.kro.kr:3000/lunch').then((res) => res.data.match(/[^점심메뉴]/g).join('').match(/[가-힣,]/g).join('').trim())
      .then(res => sendMessage(res))
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);


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