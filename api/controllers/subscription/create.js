module.exports = async function(req, res) {
  try {
    console.log('Subscribe called with body:', req.body);

    let { requestor, target } = req.body;

    let follower = await User.findOrCreate({ email: requestor }, { email: requestor });
    let following = await User.findOrCreate({ email: target }, { email: target });

    let existing = await Subscription.findOne({
      where: {
        follower: follower.id,
        following: following.id
      }
    });

    if (!existing) {
      await Subscription.create({
        follower: follower.id,
        following: following.id
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error in subscribe:', error);
    return res.status(500).json({ error: error.message });
  }
};
