const { Sequelize, Model, DataTypes } = require('sequelize');


const sequelize = new Sequelize('bd_examen', 'root', 'myXAMPPPassword01', {
    host: 'localhost',
    dialect: 'mariadb',
    "define":{
        "timestamps":false
      }
    },
    {timestamps: false}
    
);


class Movie extends Model {};
Movie.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{len: [3,20]}
    },
    date: DataTypes.DATE,
    id: {
        type: DataTypes.INTEGER, 
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    category: DataTypes.ENUM('Thriller', 'Horror', 'Comedy', 'Romance', 'SF')
}, { sequelize, modelName: 'movie'});

class CrewMember extends Model {};
CrewMember.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{len: [3,20]}
    },
    position: DataTypes.ENUM('Director', 'Writer'),
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
}, {sequelize, modelName: 'crewMember'});


Movie.hasMany(CrewMember);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }    
};

module.exports = { testConnection, sequelize, CrewMember, Movie };