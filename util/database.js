//following is the code for connecting to mysql through sequelize

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-complete',
//                                 'root',
//                                 'BLEh-1234',
//                                 {dialect: 'mysql',
//                                 host: 'localhost'
//                             }
// );

// module.exports = sequelize;

//following is the code for connecting to MongoDB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback)=>{
    
    MongoClient.connect('mongodb+srv://root:BLEh-1234@cluster0-vsvci.gcp.mongodb.net/test?retryWrites=true&w=majority')
    .then(client=>{
        console.log('Connection complete!');
        callback(client);
    }).catch(err=>{
        console.log('error connecting to mongodb');
    });
};

module.exports = mongoConnect; 
