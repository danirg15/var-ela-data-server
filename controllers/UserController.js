const User = require('../models/user')
const APIKey = require('uuid-apikey')

module.exports = {

    create: (name, callback) => {
        const API_KEY = APIKey.create()

        let user = new User({
            'name': name,
            'uuid': API_KEY.uuid,
            'api_key': API_KEY.apiKey
        })

        user.save(callback)
    },

    getOne: (id, callback) => {
        User.findById(id, callback)
    },

};

