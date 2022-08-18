module.exports = (dbConnection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title must be provided",
        },
        notEmpty: {
          msg: "Title cannot be empty",
        },
      },
    }, 
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Author must be provided",
        },
        notEmpty: {
          msg: "Author cannot be empty",
        },
      }
    },
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };
  const BookModel = dbConnection.define("Book", schema);
  return BookModel;
};
