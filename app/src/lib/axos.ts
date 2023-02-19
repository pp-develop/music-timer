import Axios from 'axios';
import { BASE_URL } from '@env'

export const axios = Axios.create({
  baseURL: BASE_URL,
});
