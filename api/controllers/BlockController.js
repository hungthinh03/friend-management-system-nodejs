module.exports = {
  blockUser: async function (req, res) {
    try {
      // Lấy email từ body request
      const { requestor, target } = req.body;

      // 1. Validate dữ liệu đầu vào
      if (!requestor || !target) {
        return res.badRequest({ success: false, message: 'Missing required fields' });
      }

      if (requestor === target) {
        return res.badRequest({ success: false, message: 'Cannot block self' });
      }

      // 2. Tìm ID của hai người dùng dựa vào email
      const requestorUser = await Account.findOne({ email: requestor });
      const targetUser = await Account.findOne({ email: target });

      if (!requestorUser || !targetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const requestorId = requestorUser.userId;
      const targetId = targetUser.userId;

      // KIỂM TRA XEM ĐÃ CHẶN TỪ TRƯỚC CHƯA (THÊM MỚI Ở ĐÂY)
      const existingBlock = await Block.findOne({
        blockerId: requestorId,
        blockedId: targetId
      });

      // NẾU ĐÃ CHẶN RỒI -> DỪNG LẠI LUÔN, KHÔNG CẦN CHẠY CODE BÊN DƯỚI NỮA
      if (existingBlock) {
        return res.badRequest({
          success: false,
          message: 'Email has already been blocked',
        });
      }

      // 3. XÓA QUAN HỆ THEO DÕI (FOLLOWER)
      // Dùng toán tử 'or' để xóa cả 2 trường hợp: A theo dõi B HOẶC B theo dõi A
      await Follower.destroy({
        or: [
          { followerId: requestorId, followeeId: targetId },
          { followerId: targetId, followeeId: requestorId }
        ]
      });

      // 4. XÓA QUAN HỆ BẠN BÈ (FRIEND)
      // Tương tự, xóa cả 2 chiều đề phòng lúc kết bạn lưu id nào trước cũng bị xóa hết
      await Friend.destroy({
        or: [
          { userId1: requestorId, userId2: targetId },
          { userId1: targetId, userId2: requestorId }
        ]
      });

      // 5. TẠO QUAN HỆ CHẶN (BLOCK)
      await Block.create({
        blockerId: requestorId,
        blockedId: targetId
      });

      // 6. Trả về đúng format JSON yêu cầu
      return res.json({ success: true });

    } catch (error) {
      console.error(error);
      return res.serverError({ success: false, message: 'Server error', error: error.message });
    }
  },


  unblockUser: async function (req, res) {
    try {
      const { requestor, target } = req.body;

      // 1. Validate dữ liệu đầu vào
      if (!requestor || !target) {
        return res.badRequest({ success: false, message: 'Missing required fields' });
      }

      // 2. Tìm ID của hai người dùng
      const requestorUser = await Account.findOne({ email: requestor });
      const targetUser = await Account.findOne({ email: target });

      if (!requestorUser || !targetUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const requestorId = requestorUser.userId;
      const targetId = targetUser.userId;

      // 3. KIỂM TRA XEM ĐANG CÓ CHẶN TỪ TRƯỚC KHÔNG
      const existingBlock = await Block.findOne({
        blockerId: requestorId,
        blockedId: targetId
      });

      // NẾU KHÔNG CÓ (CHƯA CHẶN) -> DỪNG
      if (!existingBlock) {
        return res.badRequest({
          success: false,
          message: 'Email is not blocked',
        });
      }

      // 4. NẾU CÓ CHẶN -> TIẾN HÀNH XÓA
      // Tối ưu: Dùng luôn existingBlock.id để xóa cho nhanh
      await Block.destroy({ id: existingBlock.id });

      // 5. Trả về thành công
      return res.json({ success: true });

    } catch (error) {
      console.error(error);
      return res.serverError({ success: false, message: 'Server error', error: error.message });
    }
  }

};

