module.exports = async function(req, res) {
  try {
    console.log('Common friends called with body:', req.body);

    let { friends } = req.body;
    let [emailA, emailB] = friends;

    let userA = await User.findOne({ email: emailA });
    let userB = await User.findOne({ email: emailB });

    if (!userA || !userB) {
      return res.status(200).json({ success: true, friends: [], count: 0 });
    }

    let friendsOfA = await Friendship.find({ user: userA.id }).populate('friend');
    let friendsOfB = await Friendship.find({ user: userB.id }).populate('friend');

    let emailsA = new Set(friendsOfA.map(f => f.friend.email));
    let common = friendsOfB.filter(f => emailsA.has(f.friend.email)).map(f => f.friend.email);

    return res.status(200).json({
      success: true,
      friends: common,
      count: common.length
    });

  } catch (error) {
    console.error('Error in common friends:', error);
    return res.status(500).json({ error: error.message });
  }
};
