module.exports = (dbConnection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      validate: {
        is: {
          args: [/.{8,}/], 
          msg: 'Password must be at least 8 characters long'
        },
      },
    },
  };
  const ReaderModel = dbConnection.define("Reader", schema);
  return ReaderModel;
};
