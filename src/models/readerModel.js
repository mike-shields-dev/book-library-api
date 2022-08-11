module.exports = ( dbConnection, DataTypes ) => {
    const schema = {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
    }
    const ReaderModel = dbConnection.define( 'Reader', schema );
    return ReaderModel;
}