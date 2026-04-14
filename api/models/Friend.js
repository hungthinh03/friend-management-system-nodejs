module.exports = {
  tableName: 'friend',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true
    },
    userId1: {
      type: 'number',
      columnName: 'user_id1'
    },
    userId2: {
      type: 'number',
      columnName: 'user_id2'
    }
  }
};
