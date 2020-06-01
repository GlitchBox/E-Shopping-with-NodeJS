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

let _db;

const mongoConnect = (callback)=>{
    
    MongoClient.connect('mongodb+srv://root:BLEh-1234@cluster0-5tadv.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        
        console.log('Connection complete!');
        //connection pool is stored in _db
        _db = client.db();
        callback();
    }).catch(err=>{
        
        console.log('error connecting to mongodb');
        throw err;
    });
};

const getDB = ()=>{

    if(_db){
        return _db;
    }

    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
