const mongoose = require('mongoose');


module.exports.connect = function(uri){

    mongoose.connect(uri, function(err) {
        if (err) throw err
        else console.log('Connected to DB: '+uri)
    })
    
}

