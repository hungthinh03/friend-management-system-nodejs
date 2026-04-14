module.exports.routes = {
  '/': { view: 'pages/homepage' },

  'POST /friend/connect': 'FriendController.connect',
  'POST /friend/disconnect': 'FriendController.disconnect',
  'POST /friend/list': 'FriendController.list',

  'POST /post': 'FriendController.getUpdateRecipients'
};
