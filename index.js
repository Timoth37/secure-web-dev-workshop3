const express = require('express')
const locationController = require('./locations/locations.controller')
const usersController = require('./users/users.controller')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
require('dotenv').config()
const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(locationController)
app.use(usersController)
app.use(passport.initialize())

app.get('/',(req,res)=> res.status(200).send("Hello World"))

app.listen(port, async () => {
	const result = await mongoose.connect(process.env.MONGO_URI);
	console.log("Connected with success");
	console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
})




