// This file holds the Business-Logic layer, interacting with Data Layer

const Location = require('./locations.model')

function findAll () {
	return [1,2,3,4]
}

async function findOne(id){
	const location = await Location.findById(id)
	if(!location)
		throw new Error("Not found")
	return location;
}

function addLocation(data){
	try{
		const instance = new Location(data)
		instance.save()
	}catch(e){
		throw new Error("Wrong data")
	}
	return instance
}


async function deleteByID(id){
	const location = await Location.findOneAndDelete( {_id : id})
	if(!location)
		throw new Error("Not found")
	return location
}


async function updateLocation(id, update){
	const location = await Location.updateOne({ _id: id }, update);
	if(!location)
		throw new Error("Not found")
	return location
}

module.exports.updateLocation = updateLocation;
module.exports.findOne = findOne
module.exports.findAll = findAll
module.exports.addLocation = addLocation;
module.exports.deleteById = deleteByID;
