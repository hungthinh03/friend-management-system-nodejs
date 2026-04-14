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

      // tìm hoặc tạo user
      let user1 = await Account.findOne({ email: email1 });
      if (!user1) user1 = await Account.create({ email: email1 }).fetch();

      let user2 = await Account.findOne({ email: email2 });
      if (!user2) user2 = await Account.create({ email: email2 }).fetch();

      // chuẩn hóa để tránh duplicate
      const u1 = Math.min(user1.userId, user2.userId);
      const u2 = Math.max(user1.userId, user2.userId);

      // check đã là bạn chưa
      const existed = await Friend.findOne({
        userId1: u1,
        userId2: u2
      });

      if (!existed) {
        await Friend.create({
          userId1: u1,
          userId2: u2
        });
      }

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

      const u1 = Math.min(user1.userId, user2.userId);
      const u2 = Math.max(user1.userId, user2.userId);

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
        return res.badRequest({ error: 'Email is required' });
      }

      const user = await Account.findOne({ email });

      if (!user) {
        return res.json({
          success: true,
          friends: [],
          count: 0
        });
      }

      // lấy tất cả quan hệ liên quan
      const relations = await Friend.find({
        or: [
          { userId1: user.userId },
          { userId2: user.userId }
        ]
      });

      // lấy id bạn bè
      const friendIds = relations.map(r =>
        r.userId1 === user.userId ? r.userId2 : r.userId1
      );

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

  // 6. Lấy danh sách người nhận cập nhật
  getUpdateRecipients: async function (req, res) {
    try {
      let { sender, text } = req.body;

      // sender exists
      let senderAcc = await Account.findOne({ email: sender });
      if (!senderAcc) {
        return res.badRequest({
          success: false,
          message: 'Email not found'
        });
      }
      let senderId = senderAcc.userId;

      // post cannot be blank
      if (!text || text.trim() === '') {
        return res.badRequest({
          success: false,
          message: 'Text cannot be empty'
        });
      }
      // friends
      let friends = await Friend.find({
        or: [
          { userId1: senderId },
          { userId2: senderId }
        ]
      });
      let friendIds = friends.map(f =>
        f.userId1 === senderId ? f.userId2 : f.userId1 // get id of friends
      );

      // followers
      let followers = await Follower.find({
        followeeId: senderId
      });
      let followerIds = followers.map(f => f.followerId);

      // get mentioned email
      let mentionedEmails = [];
      if (text) {
        let matches = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g);
        if (matches) {mentionedEmails = matches;}
      }
      let mentionedUsers = await Account.find({
        email: { in: mentionedEmails }
      });
      let mentionedIds = mentionedUsers.map(u => u.userId);

      // combine all recipients
      let allIds = [...friendIds, ...followerIds, ...mentionedIds];
      let uniqueIds = [...new Set(allIds)]; // remove duplicates

      // remove users who blocked sender
      let blocks = await Block.find({
        blockedId: senderId
      });
      let blockedByIds = blocks.map(b => b.blockerId);

      let finalIds = uniqueIds.filter(id => !blockedByIds.includes(id));

      // get emails of recipients
      let users = await Account.find({
        userId: { in: finalIds }
      });
      let emails = users.map(u => u.email);

      return res.json({
        success: true,
        recipients: emails
      });

    } catch (err) {
      return res.serverError(err);
    }
  }


};
