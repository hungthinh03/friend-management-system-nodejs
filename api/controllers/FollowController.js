module.exports = {
  connect: async function(req, res) {
    try {
      console.log('Subscribe called with body:', req.body);

      let {requestor, target} = req.body;

      let follower = await Account.findOne({ email: requestor });
      let following = await Account.findOne({ email: target });

      if (!follower || !following) {
        return res.badRequest({ success: false, message: 'User not found' });
      }

      let existing = await Follower.findOne({
        where: {
          followerId: follower.userId,
          followeeId: following.userId
        }
      });

      if (existing) {
        return res.status(400).json({success: false, message: 'Already following this user'});
      }

      await Follower.create({
        followerId: follower.userId,
        followeeId: following.userId
      });

      return res.status(200).json({success: true});

    } catch (error) {
      console.error('Error in subscribe:', error);
      return res.status(500).json({error: error.message});
    }
  },

  destroy: async function(req, res) {
    try {
      console.log('Unsubscribe called with body:', req.body);

      let {requestor, target} = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!requestor || !target) {
        return res.status(400).json({
          error: 'Missing required fields: requestor and target'
        });
      }

      let follower = await Account.findOne({ email: requestor });
      let following = await Account.findOne({ email: target });

      if (!follower || !following) {
        return res.badRequest({ success: false, message: 'User not found' });
      }

      let existing = await Follower.findOne({
        where: {
          followerId: follower.userId,
          followeeId: following.userId
        }
      });

      if (existing) {
        await Follower.destroy({
          followerId: follower.userId,
          followeeId: following.userId
        });
        console.log(`Unsubscribed: ${requestor} -> ${target}`);
      } else {
        console.log(`Subscription not found: ${requestor} -> ${target}`);
        return res.badRequest({ success: false, message: 'Subscription not found' });
      }

      return res.status(200).json({success: true});

    } catch (error) {
      console.error('Error in unsubscribe:', error);
      return res.status(500).json({error: error.message});
    }
  }
};
