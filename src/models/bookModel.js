module.exports = (dbConnection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    }, 
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };
  const BookModel = dbConnection.define("Book", schema);
  return BookModel;
};
