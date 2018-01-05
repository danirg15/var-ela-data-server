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
const moment_tz = 		require('moment-timezone')
const helmet = 			require('helmet')
const cors =			require('cors')
//--------------------------------------------
//		Middlewares
//--------------------------------------------
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: process.env.APP_KEY, resave: false, saveUninitialized: false }));
app.use(logger('dev'))

//--------------------------------------------
//		Configuration
//--------------------------------------------
const port = process.env.PORT || 5000

moment_tz.tz.setDefault(process.env.APP_TIME_ZONE || 'Europe/Madrid');

//--------------------------------------------
//		DB connection
//--------------------------------------------
require('./database').connect(config.DB_URI)


//--------------------------------------------
//		Routing
//--------------------------------------------
app.use('/api/analysis', require('./routes/analysis.routes'))
app.use('/api/sites', require('./routes/sites.routes'))
app.use('/api/fs', require('./routes/fs.routes'))

app.head('/', (req, res) => {
	res.status(200).send('Success')
})


//--------------------------------------------
//		Runnn!
//--------------------------------------------
const server = http.createServer(app)

server.listen(port, function(err) {
	if (err) { 
		throw err
	}
	else {
		console.log('Data Server running on port: ' + port)
		console.log('Local Gateway: ' + require('ip').address().slice(0, -1) + '1')
	}	
})


