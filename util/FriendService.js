import dbCaller from './firebase_queries';

export default class FriendService {
  async getFriendsListAsArray() {
    let ids = await dbCaller.getFriendsList();
    let friends = await dbCaller.getUsersByIdsAsArray(ids);
    return friends;
  }

  async getFriendRequestsRcvd() {
    let thisUser = await dbCaller.getCurrentUser();
    let users = await dbCaller.getUsersByIdsAsArray(thisUser.friendRequestsRcvd);
    return users;
  }

  async getFriendRequestsSent() {
    let thisUser = await dbCaller.getCurrentUser();
    let users = await dbCaller.getUsersByIdsAsArray(thisUser.friendRequestsSent);
    return users;
    //return thisUser.friendRequestsSent ? dbCaller.getUsersByIdsAsArray(thisUser.friendRequestsSent) : [];
  }

  acceptFriendRequest(id) {
    return Promise.all([dbCaller.deleteRcvdFriendRequest(id), dbCaller.addUserToFriends(id)]);
  }

  sendFriendRequest(id) {
    return dbCaller.sendFriendRequest(id);
  }

  deleteSentFriendRequest(id) {
    return dbCaller.deleteSentFriendRequest(id);
  }

  deleteRcvdFriendRequest(id) {
    return dbCaller.deleteRcvdFriendRequest(id);
  }

  removeFriend(id) {
    return dbCaller.removeFriend(id);
  }
}