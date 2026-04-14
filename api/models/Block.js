module.exports = {
  tableName: 'block',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    blockerId: {
      type: 'number',
      required: true,
      columnName: 'blocker_id'
    },
    blockedId: {
      type: 'number',
      required: true,
      columnName: 'blocked_id'
    }
  }
};
