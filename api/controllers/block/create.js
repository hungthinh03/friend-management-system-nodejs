module.exports = async function(req, res) {
  try {
    console.log('Block called with body:', req.body);

    let { requestor, target } = req.body;

    let blocker = await User.findOrCreate({ email: requestor }, { email: requestor });
    let blocked = await User.findOrCreate({ email: target }, { email: target });

    // Xóa bạn bè nếu có
    await Friendship.destroy({
      where: {
        or: [
          { user: blocker.id, friend: blocked.id },
          { user: blocked.id, friend: blocker.id }
        ]
      }
    });

    // Tạo block record
    let existingBlock = await Block.findOne({
      where: {
        blocker: blocker.id,
        blocked: blocked.id
      }
    });

    if (!existingBlock) {
      await Block.create({
        blocker: blocker.id,
        blocked: blocked.id
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error in block:', error);
    return res.status(500).json({ error: error.message });
  }
};
