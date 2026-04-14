module.exports = {
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
      let uniqueIds = [...new Set(allIds)].filter(id => id !== senderId); // remove duplicates

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

