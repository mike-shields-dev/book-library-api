module.exports = (dbConnection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Genre name already exists",
      },
      validate: {
        notNull: {
          msg: "Genre name must be provided",
        },
        notEmpty: {
          msg: "Genre name cannot be empty",
        },
      },
    },
  };
  return dbConnection.define("Genre", schema);
};
