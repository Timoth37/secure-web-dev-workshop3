const Location = require('./locations.model')

//Find all locations
function findAllLocation () {
	return Location.find()
}

//Find one location considering its ID.
async function findLocation(id){
	const location = await Location.findById(id)
	if(!location)
		throw new Error("Location not found")
	return location;
}

//Add a new location to the database.
function addLocation(data){
	try{
		const newLocation = new Location(data)
		newLocation.save()
		return newLocation
	}catch(e){
		throw new Error("Wrong data")
	}
}

//Delete a  location to the database considering its ID.
async function deleteLocation(id){
	const location = await Location.findOneAndDelete( {_id : id})
	if(!location)
		throw new Error("Location not found")
}

//Update a location considering its ID.
async function updateLocation(id, update){
	const location = await Location.updateOne({ _id: id }, update);
	if(!location)
		throw new Error("Location not found")
}


module.exports.updateLocation = updateLocation;
module.exports.findLocation = findLocation
module.exports.findAllLocation = findAllLocation
module.exports.addLocation = addLocation;
module.exports.deleteLocation = deleteLocation;
