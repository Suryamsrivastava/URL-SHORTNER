const mongoose = require('mongoose');

async function connectToMongoDB(url){
    connectTimeoutMS: 20000
    return mongoose.connect(url);
}

module.exports = {
  connectToMongoDB,
};
