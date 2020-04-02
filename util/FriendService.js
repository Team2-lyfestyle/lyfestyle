import dbCaller from './DatabaseCaller';

export default class FriendService {
  async getFriendsListAsArray() {
    let ids = await dbCaller.getFriendsList();
    let friends = await dbCaller.getUsersById(ids);
    return friends;
  }
}