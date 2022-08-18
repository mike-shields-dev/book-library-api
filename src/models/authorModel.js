module.exports = (dbConnection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Name already exists",
      },
      validate: {
        notNull: {
          msg: "Name must be provided",
        },
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
  };
  const AuthorModel = dbConnection.define("Author", schema);
  return AuthorModel;
};
