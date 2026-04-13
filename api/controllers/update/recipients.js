module.exports = async function(req, res) {
  try {
    console.log('Get recipients called with body:', req.body);

    let { sender, text } = req.body;

    let senderUser = await User.findOne({ email: sender });
    if (!senderUser) {
      return res.status(200).json({ success: true, recipients: [] });
    }

    // Lấy bạn bè
    let friendships = await Friendship.find({ user: senderUser.id }).populate('friend');
    let friends = friendships.map(f => f.friend.email);

    // Lấy followers
    let subscriptions = await Subscription.find({ following: senderUser.id }).populate('follower');
    let followers = subscriptions.map(s => s.follower.email);

    // Lấy mentions
    let mentionRegex = /([\w\.\-]+@[\w\.\-]+)/g;
    let mentions = text.match(mentionRegex) || [];

    // Tổng hợp
    let allRecipients = [...new Set([...friends, ...followers, ...mentions])];

    // Lọc người đã block sender
    let recipients = [];
    for (let email of allRecipients) {
      let user = await User.findOne({ email });
      if (!user) continue;

      let isBlocked = await Block.findOne({
        where: {
          blocker: user.id,
          blocked: senderUser.id
        }
      });

      if (!isBlocked) {
        recipients.push(email);
      }
    }

    return res.status(200).json({
      success: true,
      recipients: recipients
    });

  } catch (error) {
    console.error('Error in get recipients:', error);
    return res.status(500).json({ error: error.message });
  }
};
