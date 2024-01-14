import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLocalStorage, setStorageValue } from "./useLocalStorage";

// ローカルストレージにisLoggedInがなければデフォルト値falseを作成する関数
const createDefaultLoginStatus = async () => {
  const existingStatus = await AsyncStorage.getItem('isLoggedIn');
  if (existingStatus === null) {
    await AsyncStorage.setItem('isLoggedIn', 'false');
  }
};

// ログイン状態を取得する関数
export const isLogin = () => {
  const [isLoggedIn] = useLocalStorage("isLoggedIn", "false");
  return isLoggedIn === "true";
};

// ログイン処理を行う関数
export const setLoginStatus = () => {
  setStorageValue("isLoggedIn", "true");
};

// ログアウト処理を行う関数
export const setLogoutStatus = () => {
  setStorageValue("isLoggedIn", "false");
};

export const useLoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem('isLoggedIn');
    console.log(status)
    setIsLoggedIn(status == 'true');
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return isLoggedIn;
};