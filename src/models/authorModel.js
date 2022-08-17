module.exports = (dbConnection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
    },
  };
  const AuthorModel = dbConnection.define("Author", schema);
  return AuthorModel;
};
