const express = require('express')
const locationController = require('./locations/locations.controller')
const mongoose = require("mongoose");
const app = express()
const port = 3000


app.use(locationController)



async function main(){
	require('dotenv').config()
	const mongoose =require('mongoose');
	const result = await mongoose.connect(process.env.MONGO_URI);
	console.log("Connected with success");
	app.listen(port, () => {
		console.log(`API listening on port ${port}, visit http://localhost:${port}/`)
	})
}

main()




