module.exports = (dbConnection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Book title must be provided",
        },
        notEmpty: {
          msg: "Book title cannot be empty",
        },
      },
    }, 
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Book author must be provided",
        },
        notEmpty: {
          msg: "Book author cannot be empty",
        },
      }
    },
    ISBN: DataTypes.STRING,
  };
  
  return dbConnection.define("Book", schema);
};
