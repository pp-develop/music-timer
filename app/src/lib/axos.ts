import Axios from 'axios';
import { API_URL } from '../config';

export const axios = Axios.create({
  baseURL: API_URL,
});

// axios.interceptors.request.use(response => {
//   // 同様にresponseをreturnする必要がある
//   console.log("test")
//   return response
// }, err => {
//   // 何らかのエラー処理
//   return Promise.reject(err)
// })