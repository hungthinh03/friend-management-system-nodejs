module.exports.routes = {
  '/': { view: 'pages/homepage' },

  'POST /friend/connect': 'FriendController.connect',
  'POST /friend/disconnect': 'FriendController.disconnect',

  'POST /friend/list': 'FriendController.list',
  'POST /friend/common': 'FriendController.common',

  'POST /follow/subscribe': 'FollowController.connect',
  'POST /follow/unsubscribe': 'FollowController.destroy',

  'POST /block/block': 'BlockController.blockUser',
  'POST /block/unblock': 'BlockController.unblockUser',

  'POST /post': 'PostController.getUpdateRecipients'
};
