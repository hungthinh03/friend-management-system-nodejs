module.exports = async function(req, res) {
  try {
    console.log('Get friends list called with body:', req.body);

    let { email } = req.body;

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(200).json({ success: true, friends: [], count: 0 });
    }

    // Lấy danh sách bạn bè
    let friendships = await Friendship.find({ user: user.id }).populate('friend');
    let friends = friendships.map(f => f.friend.email);

    return res.status(200).json({
      success: true,
      friends: friends,
      count: friends.length
    });

  } catch (error) {
    console.error('Error in get friends list:', error);
    return res.status(500).json({ error: error.message });
  }
};
