module.exports.routes = {
  '/': { view: 'pages/homepage' },
  'POST /post': 'FriendController.getUpdateRecipients'
};
