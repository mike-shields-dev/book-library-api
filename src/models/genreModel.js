module.exports = (dbConnection, DataTypes) => {
  const schema = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
  const GenreModel = dbConnection.define("Genre", schema);
  return GenreModel;
};
