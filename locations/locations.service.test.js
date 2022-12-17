const locationsService = require("./locations.service")
const Location = require("./locations.model")

jest.mock("./locations.model")

beforeEach(()=>{
    jest.resetAllMocks()
})

//Test of findLocation function, with a valid and an unknown location
describe('Locations findLocation', ()=> {
    it('should find an existing Location', async () => {
        const mockLocation = {
            _id: '1234', filmName : 'Jiji la crevette'
        }
        Location.findById.mockResolvedValue(mockLocation);
        const location = await locationsService.findLocation(mockLocation._id);
        expect(location).toEqual(mockLocation)
        expect(Location.findById).toHaveBeenCalledTimes(1)
        expect(Location.findById).toHaveBeenCalledWith(mockLocation._id);
    });

    it('should throws an error if the location does not exist', async () => {
        const mockLocation = {
            _id: '1234', filmName : 'Jiji la crevette'
        }
        Location.findById.mockResolvedValue();
        try {
            await locationsService.findLocation(mockLocation._id);
        } catch (error) {
            expect(error.message).toBe('Location not found');
        }
    });
})

//Tests of deleteLocation function, with a valid and an unknown location
describe('Locations deleteLocation', ()=>{
    it('should delete an existing location', async () => {
        const id = '123';
        Location.findOneAndDelete.mockResolvedValue("Valid");
        await locationsService.deleteLocation(id);
        expect(Location.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
    });

    it('should throws an error if the location does not exist', async () => {
        const id = '123';
        const deleteOne = jest.fn().mockResolvedValue();
        Location.deleteOne = deleteOne;
        try {
            await locationsService.deleteLocation(id);
        } catch (error) {
            expect(error.message).toBe('Location not found');
        }
    });
})


//Test of updateLocation function, with a valid and an unknown location
describe('Locations updateLocation', ()=>{
    it('should update an existing location', async () => {
        const id = '123';
        const update = { name: 'New York', country: 'USA' };
        const location = {};
        const updateOne = jest.fn().mockResolvedValue("Valid");
        Location.updateOne = updateOne;

        await locationsService.updateLocation(id, update);
        expect(updateOne).toHaveBeenCalledWith({ _id: id }, update);
    });

    it('should throws an error if the location does not exist', async () => {
        const id = '123';
        const update = { name: 'New York', country: 'USA' };
        const updateOne = jest.fn().mockResolvedValue(null);
        Location.updateOne = updateOne;
        try {
            await locationsService.updateLocation(id, update);
        } catch (error) {
            expect(error.message).toBe('Location not found');
        }
    });
})

//Test of addLocation function, with valid and invalid data
describe('Location AddLocation', () =>{

    test('should saves a new location to the database', async () => {
        const data = { name: 'New York', country: 'USA' };
        const save = jest.fn().mockResolvedValue();
        Location.mockImplementation(() => ({
            save
        }));

        await locationsService.addLocation(data);

        expect(Location).toHaveBeenCalledWith(data);
        expect(save).toHaveBeenCalled();
    });

    it('should throws an error if the data is invalid', async () => {
        const data = {};
        const save = jest.fn().mockResolvedValue(new Error('Wrong data'));
        Location.mockImplementation(() => ({
            save
        }));
        try {
            await locationsService.addLocation(data);
        } catch (error) {
            expect(error.message).toBe('Wrong data');
        }
    });
})


