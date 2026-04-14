module.exports = {
  tableName: 'follower',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      autoIncrement: true   // important
    },
    followerId: {
      type: 'number',
      required: true,
      columnName: 'follower_id'
    },
    followeeId: {
      type: 'number',
      required: true,
      columnName: 'followee_id'
    }
  }
};
