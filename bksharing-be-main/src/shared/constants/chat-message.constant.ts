export enum SOCKET_DOMAINS {
  //   HOST_CMS = '',
  //   HOST_ECM = '*',
  LOCAL_FE = 'http://localhost:3000',
}

export enum SOCKET_CHAT_MESSAGE_EVENT {
  SEND_PRIVATE_MESSAGE = 'send-message',
  JOIN_PRIVATE_ROOM = 'join-room',
  JOIN_GROUP_ROOM = 'join-group-room',
  SEND_GROUP_MESSAGE = 'send-group-message',
  READ_MESSAGE = 'read-message',
  NEW_MESSAGE = 'newMessage',
}

export const NUMBER_OF_MESSAGE_DEFAULT = 0;
export const NUMBER_MESSAGE_INCREMENT_DEFAULT = 1;
export const NUMBER_PARTICIPANT_INCREMENT_DEFAULT = 1;
export const NUMBER_OF_PARTICIPANT_DEFAULT = 1;
