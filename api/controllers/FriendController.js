module.exports = {

  /**
   * 1. Tạo kết nối bạn bè
   */
  connect: async (req, res) => {
    try {
      const { friends } = req.body;

      if (!friends || friends.length !== 2) {
        return res.badRequest({ error: 'Invalid input' });
      }

      const [email1, email2] = friends;

      if (email1 === email2) {
        return res.badRequest({ error: 'Cannot friend yourself' });
      }

      const user1 = await Account.findOne({ email: email1 });
      const user2 = await Account.findOne({ email: email2 });

      if (!user1 || !user2) {
        return res.badRequest({ error: 'User not found' });
      }

      const u1 = Math.min(user1.user_id, user2.user_id);
      const u2 = Math.max(user1.user_id, user2.user_id);

      const existed = await Friend.findOne({
        user_id1: u1,
        user_id2: u2
      });

      if (existed) {
        return res.json({ success: true }); 
      }

      await Friend.create({
        user_id1: u1,
        user_id2: u2
      });

      return res.json({ success: true });

    } catch (err) {
      return res.serverError(err);
    }
  },

  /**
   * 2. Hủy kết nối bạn bè
   */
  disconnect: async (req, res) => {
    try {
      const { friends } = req.body;

      if (!friends || friends.length !== 2) {
        return res.badRequest({ error: 'Invalid input' });
      }

      const [email1, email2] = friends;

      const user1 = await Account.findOne({ email: email1 });
      const user2 = await Account.findOne({ email: email2 });

      if (!user1 || !user2) {
        return res.badRequest({ error: 'User not found' });
      }
      const u1 = Math.min(user1.user_id, user2.user_id);
      const u2 = Math.max(user1.user_id, user2.user_id);

      await Friend.destroy({
        user_id1: u1, user_id2: u2
      });

      return res.json({ success: true });
    } catch (err) {
      return res.serverError(err);
    }
  },
  /**
   * 3. Lấy danh sách bạn bè của một email
   */
  list: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.badRequest({ error: 'Email is required' });
      }

      const user = await Account.findOne({ email });

      if (!user) {
        return res.badRequest({ error: 'User not found' });
      }

      const relations = await Friend.find({
        or: [
          { user_id1: user.user_id },
          { user_id2: user.user_id }
        ]
      });

      const friendIds = [
        ...new Set(
          relations.map(r =>
            r.user_id1 === user.user_id ? r.user_id2 : r.user_id1
          )
        )
      ];

      if (friendIds.length === 0) {
        return res.json({
          success: true,
          friends: [],
          count: 0
        });
      }

      const friends = await Account.find({
        user_id: friendIds
      });

      return res.json({
        success: true,
        friends: friends.map(f => f.email),
        count: friends.length
      });

    } catch (err) {
      return res.serverError(err);
    }
  }

};