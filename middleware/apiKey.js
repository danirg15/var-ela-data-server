const APIKey = require('uuid-apikey')

module.exports = (req, res, next) => {
    let api_key = req.headers.api_key || req.body.api_key || req.query.api_key
    
    if (!api_key) {
        console.log('No APIKey provided')
        res.status(401).json({ 'error': 'No APIKey provided' })
    }
    else{
        if (APIKey.isAPIKey(api_key)) {
            next()
        }
        else{
            console.log('Invalid API Key')
            res.status(401).json({ 'error': 'Invalid API Key' })
        }
    }
}
