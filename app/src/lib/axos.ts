import Axios from 'axios';
import { API_URL, BASE_URL } from '../config';

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': BASE_URL,
    'Access-Control-Allow-Headers': '*',
    "Access-Control-Allow-Credentials": 'true',
  },
  withCredentials: true,
});
