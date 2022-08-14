module.exports = (dbConnection, DataTypes) => {
  const schema = {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    genre: DataTypes.STRING,
    ISBN: DataTypes.STRING,
  };
  const BookModel = dbConnection.define("Book", schema);
  return BookModel;
};
