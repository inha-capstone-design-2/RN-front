import io from 'socket.io-client';
import Config from 'react-native-config';

const socket = io('http://192.168.0.103:4000', {
  transports: ['websocket'],
});

export default socket;
