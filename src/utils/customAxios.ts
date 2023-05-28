import axios, {AxiosInstance} from 'axios';
import Config from 'react-native-config';

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${Config.BACK_URL}`, // 기본 서버 주소 입력
});

export const chatAxios: AxiosInstance = axios.create({
  baseURL: `${Config.CHAT_URL}`,
});
