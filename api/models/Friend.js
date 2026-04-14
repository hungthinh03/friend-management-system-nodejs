module.exports = {
  tableName: 'friend',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true   // important
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
