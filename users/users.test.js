const usersServices = require("./users.service")
const User = require("./users.model")
jest.mock("./users.model")

beforeEach(()=>{
    jest.resetAllMocks()
})

//Test of findUser function, with a valid and an unknown user
describe('Users findUser', ()=> {
    it('should find an existing user', async () => {
        const mockUser = {
            _id: '1234', username : 'Test'
        }
        User.findOne.mockResolvedValue(mockUser);
        const user = await usersServices.findUser({_id : mockUser._id});
        expect(user).toEqual(mockUser)
        expect(User.findOne).toHaveBeenCalledTimes(1)
        expect(User.findOne).toHaveBeenCalledWith({_id : mockUser._id});
    });

    it('should throws an error if the user does not exist', async () => {
        const mockUser = {
            _id: '1234', username : 'Test'
        }
        User.findOne.mockResolvedValue();
        try {
            await usersServices.findUser({_id : mockUser._id});
        } catch (error) {
            expect(error.message).toBe('User not found');
        }
    });
})

//Test of deleteUser function, with a valid and an unknown user
describe('User deleteUser', ()=>{
    it('should delete an existing user', async () => {
        const id = '123';
        User.findOneAndDelete.mockResolvedValue(123);
        await usersServices.deleteUser(id);
        expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: id });
        expect(User.findOneAndDelete).toHaveBeenCalledTimes(1);

    });

    it('should throws an error if the user does not exist', async () => {
        const id = '123';
        User.findOneAndDelete = jest.fn().mockResolvedValue();
        try {
            await usersServices.deleteUser(id);
        } catch (error) {
            expect(error.message).toBe('User not found');
        }
    });
})


//Test of updateUser function, with a valid and an unknown user
describe('User updateUser', ()=>{
    it('should update an existing user', async () => {
        const id = '123';
        const update = { username: 'Test', password: 'password' };
        User.updateOne = jest.fn().mockResolvedValue("Valid");
        await usersServices.updateUser(id, update);
        expect(User.updateOne).toHaveBeenCalledTimes(1)
    });

    it('should throws an error if the user does not exist', async () => {
        const id = '123';
        const update = { username: 'Test', password: 'password' };
        User.updateOne = jest.fn().mockResolvedValue();
        try {
            await usersServices.updateUser(id, update);
        } catch (error) {
            expect(error.message).toBe('User not found');
        }
    });
})


//Test of addUser function, with valid and invalid data
describe('User addUser', () =>{
    test('should saves a new user to the database', async () => {
        const data = { username: 'Test', password: 'password' };
        const save = jest.fn().mockResolvedValue();
        User.mockImplementation(() => ({
            save
        }));
        await usersServices.registerUser(data);
        expect(save).toHaveBeenCalled();
    });

    it('should throws an error if the data is invalid', async () => {
        const data = {};
        const save = jest.fn().mockResolvedValue(new Error('Wrong data'));
        User.mockImplementation(() => ({
            save
        }));
        try {
            await usersServices.registerUser(data);
        } catch (error) {
            expect(error.message).toBe('Wrong data');
        }
    });
})