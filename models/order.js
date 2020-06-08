// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define('order', {

//     id:{
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     address:{
//         type: Sequelize.STRING,
//     }
// });

// module.exports = Order;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({

    items: [
        {
            product: {type: Object, required: true},
            quantity: {type: Number, required: true} 
        }
    ],

    user: {

        id: {
            type: Schema.Types.ObjectId,
            // ref: 'User',
            required: true
        },
        email: {
            type: String
        }
    }
});

module.exports = mongoose.model('orders', Order);