module.exports = async function(req, res) {
  try {
    console.log('Create friend called with body:', req.body);

    let { friends } = req.body;

    if (!friends || friends.length !== 2) {
      return res.status(400).json({ error: 'Need exactly 2 emails' });
    }

    let [emailA, emailB] = friends;

    // Tìm hoặc tạo user
    let userA = await User.findOrCreate({ email: emailA }, { email: emailA });
    let userB = await User.findOrCreate({ email: emailB }, { email: emailB });

    // Kiểm tra block
    let blocked = await Block.findOne({
      where: {
        or: [
          { blocker: userA.id, blocked: userB.id },
          { blocker: userB.id, blocked: userA.id }
        ]
      }
    });

    if (blocked) {
      return res.status(400).json({ error: 'User blocked' });
    }

    // Kiểm tra đã là bạn chưa
    let existing = await Friendship.findOne({
      where: {
        or: [
          { user: userA.id, friend: userB.id },
          { user: userB.id, friend: userA.id }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already friends' });
    }

    // Tạo kết bạn (2 chiều)
    await Friendship.createEach([
      { user: userA.id, friend: userB.id },
      { user: userB.id, friend: userA.id }
    ]);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error in create friend:', error);
    return res.status(500).json({ error: error.message });
  }
};
