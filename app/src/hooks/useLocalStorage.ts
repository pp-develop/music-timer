import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getStorageValue(key: string, defaultValue: string) {
  // getting stored value
  const saved = await AsyncStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const setStorageValue = (key: string, value: string) => {
  AsyncStorage.setItem(key, JSON.stringify(value));
};

export const useLocalStorage = (key: string, defaultValue: string) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    AsyncStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};