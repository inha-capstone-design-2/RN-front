import axios, {AxiosInstance} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Config from 'react-native-config';

// const accessToken = useSelector((state: RootState) => state.user.accessToken);

export const customAxios: AxiosInstance = axios.create({
  baseURL: `${Config.BACK_URL}`, // 기본 서버 주소 입력
  // headers: {
  //   Authorization: `bearer ${accessToken}`,
  // },
});
