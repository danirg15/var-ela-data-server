const mongoose = require('mongoose');


module.exports.connect = function(uri){

    mongoose.connect(uri, { useMongoClient: true })
    	.then(() => console.log('Connected to DB: '+uri))
    	.catch(err => console.error(err))
    
}

