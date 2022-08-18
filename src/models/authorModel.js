module.exports = (dbConnection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Author name already exists",
      },
      validate: {
        notNull: {
          msg: "Author name must be provided",
        },
        notEmpty: {
          msg: "Author name cannot be empty",
        },
      },
    },
  };
  const AuthorModel = dbConnection.define("Author", schema);
  return AuthorModel;
};
