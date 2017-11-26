//--------------------------------------------
//		App Modules
//--------------------------------------------
const http =			require('http')
const express = 		require('express')
const app 	= 			express()
const bodyParser = 		require('body-parser')
const session = 		require('express-session')
const env = 			require('dotenv').config()
const logger = 			require('morgan')
const config = 			require('config')
// const auth = 			require('./middleware/jwtAuth')
const moment_tz = 		require('moment-timezone')
const helmet = 			require('helmet')

//--------------------------------------------
//		Middlewares
//--------------------------------------------
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: process.env.APP_KEY, resave: false, saveUninitialized: false }));

//--------------------------------------------
//		Configuration
//--------------------------------------------
const port = process.env.PORT || 3000

moment_tz.tz.setDefault(process.env.APP_TIME_ZONE || 'Europe/Madrid');

if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('dev'))
}


//--------------------------------------------
//		DB connection
//--------------------------------------------
require('./database').connect(config.DB_URI)



//--------------------------------------------
//		Routing
//--------------------------------------------
app.use('/api/analysis', require('./routes/analysis.routes'))


app.use(function(err, req, res, next){
  res.status(400).json(err);
});

//--------------------------------------------
//		Runnn!
//--------------------------------------------
const server = http.createServer(app)

server.listen(port, function(err) {
	if (err) throw err
	console.log('Data Server running on port: ' + port)
})



const Analysis = require('./models/analysis')
Analysis.findOne({}, (err, analysis) => {
	require('./jobs/AnalysisJob').handle(analysis)
})


