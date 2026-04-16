module.exports = {
  /**
   * 1. Tạo kết nối bạn bè
   */
  connect: async (req, res) => {
    try {
      const { friends } = req.body;

      if (!friends || friends.length !== 2) {
        return res.badRequest({ success: false, message: 'Invalid input' });
      }

      const [email1, email2] = friends;

      if (email1 === email2) {
        return res.badRequest({ success: false, message: 'Cannot friend yourself' });
      }

      // tìm hoặc tạo user
      const user1 = await Account.findOne({ email: email1 });
      const user2 = await Account.findOne({ email: email2 });

      if (!user1 || !user2) {
        return res.badRequest({ success: false, message: 'User not found' });
      }

      // chuẩn hóa để tránh duplicate
      const u1 = Math.min(user1.userId, user2.userId);
      const u2 = Math.max(user1.userId, user2.userId);

      // check đã là bạn chưa
      const existed = await Friend.findOne({
        userId1: u1,
        userId2: u2
      });

      if (existed) {
        return res.badRequest({ success: false, message: 'You are already friends' });
      }

      await Friend.create({
        userId1: u1,
        userId2: u2
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
        return res.badRequest({ success: false, message: 'Invalid input' });
      }

      const [email1, email2] = friends;

      const user1 = await Account.findOne({ email: email1 });
      const user2 = await Account.findOne({ email: email2 });

      if (!user1 || !user2) {
        return res.badRequest({ success: false, message: 'User not found' });
      }

      const u1 = Math.min(user1.userId, user2.userId);
      const u2 = Math.max(user1.userId, user2.userId);

      // check đã là bạn chưa
      const existed = await Friend.findOne({
        userId1: u1,
        userId2: u2
      });

      if (!existed) {
        return res.badRequest({ success: false, message: 'You are not already friends' });
      }

      await Friend.destroy({
        userId1: u1,
        userId2: u2
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
        return res.badRequest({ success: false, message: 'Email is required' });
      }

      const user = await Account.findOne({ email });

      if (!user) {
        return res.badRequest({ error: 'User not found' });
      }

      // lấy tất cả quan hệ liên quan
      const relations = await Friend.find({
        or: [
          { userId1: user.userId },
          { userId2: user.userId }
        ]
      });

      // lấy id bạn bè
      const friendIds = [
        ...new Set(
          relations.map(r =>
            r.userId1 === user.userId ? r.userId2 : r.userId1
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

      // lấy email
      const friends = await Account.find({
        userId: friendIds
      });

      return res.json({
        success: true,
        friends: friends.map(f => f.email),
        count: friends.length
      });

    } catch (err) {
      return res.serverError(err);
    }
  },

  common: async (req, res) => {
    try {
      let { friends } = req.body;
      let [emailA, emailB] = friends;

      let userA = await Account.findOne({ email: emailA });
      let userB = await Account.findOne({ email: emailB });

      if (!userA || !userB) {
        return res.status(400).json({success: false, message: 'User not found'});
      }

      if (emailA === emailB) {
        return res.badRequest({ success: false, message: 'Cannot be same emails' });
      }

      let relationsA = await Friend.find({
        or: [
          { userId1: userA.userId },
          { userId2: userA.userId }
        ]
      });
      let relationsB = await Friend.find({
        or: [
          { userId1: userB.userId },
          { userId2: userB.userId }
        ]
      });

      // Lấy danh sách bạn A và B
      let friendsA = new Set(
        relationsA.map(r =>
          r.userId1 === userA.userId ? r.userId2 : r.userId1
        )
      );

      let friendsB = new Set(
        relationsB.map(r =>
          r.userId1 === userB.userId ? r.userId2 : r.userId1
        )
      );

      // Lấy bạn chung
      let commonIds = [...friendsA].filter(id => friendsB.has(id));
      let commonUsers = await Account.find({
        userId: commonIds
      });

      let commonEmails = commonUsers.map(u => u.email);

      return res.json({
        success: true,
        friends: commonEmails,
        count: commonEmails.length
      });

    } catch (err) {
      return res.serverError(err);
    }
  }

};
