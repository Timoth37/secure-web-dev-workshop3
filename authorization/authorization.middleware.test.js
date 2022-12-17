const authorizationMiddleware = require('./authorization.middleware');


beforeEach(()=>{
    jest.resetAllMocks()
})

//Different tests on the authorization middleware (with valid role, 401 error and 403 error)
describe('Authorization Middleware', () =>{

    it('should allows access to users with a valid role', () => {
        const allowedRoles = ['admin', 'user'];
        const req = {
            user: {
                role: 'admin'
            }
        };
        const res = {
            status: jest.fn().mockReturnValue({
                send: jest.fn()
            })
        };
        const next = jest.fn();

        authorizationMiddleware.canAccess(allowedRoles)(req, res, next);

        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it('should returns 401 for unauthenticated users', () => {
        const allowedRoles = ['admin', 'user'];
        const req = {
            user: undefined
        };
        const res = {
            status: jest.fn().mockReturnValue({
                send: jest.fn()
            })
        };
        const next = jest.fn();

        authorizationMiddleware.canAccess(allowedRoles)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status().send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('should returns 403 for users with an invalid role', () => {
        const allowedRoles = ['admin', 'user'];
        const req = {
            user: {
                role: 'manager'
            }
        };
        const res = {
            status: jest.fn().mockReturnValue({
                send: jest.fn()
            })
        };
        const next = jest.fn();

        authorizationMiddleware.canAccess(allowedRoles)(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.status().send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
})