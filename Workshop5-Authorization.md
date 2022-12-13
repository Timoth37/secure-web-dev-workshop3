# Workshop 5 - User Authorization (Middleware)

## 🌟 Goal

> Limit user access to resources

## 💡 Concept

Authorization is a process used to limit user's access to resources, by applying one or multiple rules.

We will implement an RBAC (Role Based Access Control) authorization middleware. The purpose of this middleware
is to check whether the User at the origin of the request has a role registered in resource's allowed roles.

For this, users must have a `role` property, to save their roles. Be careful not to let users update their own role !
(no privilege elevation)

And resources (API Endpoints) must declare a list of "Allowed Roles".

For the middleware to function properly, it must be used after an authentication middleware, to know which user made the request.

## 🗒 What to do

1. In the model `Users`, add a `role` property
2. Create a new Authorization middleware. It is a Higher-Order Function taking 1 parameter: `(allowedRoles)` an array of allowed roles, and returning a function with 3 parameters: `(req, res, next)` (express parameters)
   1. This middleware returns a 403 when
      1. No user is given in `req.user` (missing authentication)
      2. User's role is not included in parameter `allowedRoles`
3. Call this middleware on routes to protect


## Quick word on Higher-Order Functions

You probably already heard of them, from math classes of CS classes. Taking Wikipedia's definition:
> [...] a higher-order function (HOF) is a function that does at least one of the following:
> - takes one or more functions as arguments (i.e. a procedural parameter, which is a parameter of a procedure that is itself a procedure), 
> - returns a function as its result.

Today we are working with the second type, HOF that `returns a function as its result`

In Javascript, they are implemented like this:
```javascript
const roleMiddleware = (allowedRoles) => (req, res, next) => allowedRoles.includes(req.user?.role) ? next() : res.status(403).send()
```

Of without arrow functions:
```javascript
function roleMiddleware (allowedRoles) {
	return function (req, res, next) {
		if (allowedRoles.includes(req.user?.role)) {
			return next()
        }
		return res.status(403).send()
	}
}
```

## HOF with Express

The examples above are valid middlewares for express. Express expects functions taking `(req, res, next)` as parameters
this is why your functions handling logic in your `controllers` have these parameters.

`req` holds all the data received, `res` keeps functions to send a response, and `next` is a function that
sends a signal to `Express` to try and start the next function/middleware in the router configuration.

When you need to pass some extra arguments to a middleware, like a list of `allowedRoles`, HOF comes handy:
```javascript
router.get('/locations', passport.authenticate(.......), roleMiddleware(['admin']), (req,res) => {
	res.status(200).send(req.user)
})
```
