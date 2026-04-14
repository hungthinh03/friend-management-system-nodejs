module.exports = {
  tableName: 'account',
  primaryKey: 'userId',

  attributes: {
    userId: {
      type: 'number',
      autoIncrement: true,
      columnName: 'user_id'
    },
    email: {
      type: 'string',
      columnType: 'varchar(50)',
      required: true
    }
  }
};
