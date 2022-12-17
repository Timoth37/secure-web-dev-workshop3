const router = require('express').Router()
const locationsService = require('./locations.service')
const passport = require('passport')
const authorizationMiddleware = require("../authorization/authorization.middleware");

router.get('/', (req, res) => {
	return res.status(200).send("Hello World")
})

//Users authenticated as "User" or "Admin" can get all the locations.
router.get('/locations',
	passport.authenticate('jwt',{session : false}),
	authorizationMiddleware.canAccess(['admin', 'user']),
	async(req, res) => {
	const locations = await locationsService.findAllLocation()
	return res.status(200).send(locations)
})

//Users authenticated as "User" or "Admin" can get a specific location by providing its ID.
router.get('/locations/:id',
	passport.authenticate('jwt',{session : false}),
	authorizationMiddleware.canAccess(['admin', 'user']),
	async(req,res) =>{
	try{
		const location = await locationsService.findLocation(req.params['id'])
		return res.status(200).send(location)
	}catch(e){
		if(e.message==="Location not found"){
			return res.status(404).send(e.toString())
		}
		return res.status(400).send("Bad request")
	}

})

//Users authenticated as "Admin" can add a location to the database
router.post('/locations',
	passport.authenticate('jwt',{session : false}),
	authorizationMiddleware.canAccess(['admin']),
	async (req,res, next) =>{
	try{
		const location = await locationsService.addLocation({...req.body, endDate:new Date(req.body.endDate), startDate: new Date(req.body.startDate)})
		return res.status(200).send(location +" has been added with success")
	}catch(e){
		return res.status(400).send("Bad request")
	}
})

//Users authenticated as "Admin" can delete a location in the database by providing its ID.
router.delete('/locations/:id',
	passport.authenticate('jwt',{session : false}),
	authorizationMiddleware.canAccess(['admin']),
	async (req,res)=>{
	try{
		await locationsService.deleteLocation(req.params.id)
		return res.status(200).send("Location with "+req.params.id+" as ID deleted successfully")
	}catch(e){
		if(e.message==="Location not found"){
			return res.status(404).send(e.toString())
		}
		return res.status(400).send("Bad request")
	}
})

//Users authenticated as "Admin" can modify a location in the database by providing its ID and the modified location in the body.
router.put('/locations/:id',
	passport.authenticate('jwt',{session : false}),
	authorizationMiddleware.canAccess(['admin']),
	async (req,res)=>{
	try{
		await locationsService.updateLocation(req.params.id, {...req.body, endDate:new Date(req.body.endDate), startDate: new Date(req.body.startDate)})
		return res.status(200).send("Location with "+req.params.id+" as ID updated successfully!")
	}catch(e){
		if(e.message==="Location not found"){
			return res.status(404).send(e.toString())
		}
		return res.status(400).send("Bad request")
	}
})


module.exports = router
