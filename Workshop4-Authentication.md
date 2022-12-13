# Workshop 4 - User Authentication (Passport, BCrypt)

## 🌟 Goal

> Authenticate users and secure access to backend data

## 👷 Prerequisites

1. Install dependencies `bcrypt`, `passport`, `passport-local`, `passport-jwt` and `jsonwebtoken`

## 💡 Concept

Authentication is used to know which user performs an action. The backend can deny access to resources for
not authenticated users. The authentication can also be used to scope the user's access.

There are multiple techniques for limiting users permissions, we will see some on another workshop. The goal for
today is to offer registration and authentication capabilities.

#### Registration

Anyone can register an account on our backend by giving a `username` and a `password`.
> We NEVER store plaintext passwords !

Once a registration request is received, the password is `hashed` with bcrypt, and the user is stored with this
password hash in database.

Use a `salt` when hashing password, to protect your data against
[Rainbow Table](https://fr.wikipedia.org/wiki/Rainbow_table) attacks (table containing a list of hash with their
non-hashed value)

#### Login

A registered user can "Log-In" to our backend by providing its `username` and `password`.

Once a login request is received, the backend will hash the password and compare it with the hash stored on the user.
If hashes match, the backend will deliver a JSON Web Token (JWT), a proof of authentication containing the user's ID.

#### Authentication

For any protected requests, the user must give its JWT (issued by backend on Login). A middleware will check JWT
authenticity and accept or deny the request.

The JWT is given in request's headers: `Authorization: Bearer eyJh[...]`

Client (User) -> Makes a `POST /locations` request with its JWT -> JWT Middleware checks JWT:

1. Case 1: Valid JWT -> Proceed to location creation
2. Case 2: Invalid JWT (expired, unsigned, wrong signature...) -> 403 Error

You can play with JWT at [JWT.io](https://jwt.io/)

#### Passport ? Middleware ? What are those ??

A middleware is a function called before or after a route handler. Basically, you can have an existing route:

```javascript
router.get('/locations', (req, res) => res.send(200).body({ locations: [] }))
```

Now you want to protect it from unauthenticated users. Middlewares can help !

```javascript
router.get('/locations', checkUser, (req, res) => res.send(200).body({ locations: [] }))
```

Or, to apply it to multiple routes:

```javascript
router.use(checkUser)
router.get('/locations', (req, res) => res.send(200).body({ locations: [] }))
```

The wonderful thing is that middlewares have access to `req` and `res` objects, meaning they can throw errors before the
actual route handler, or **add data to request!**

This is where Passport middlewares shines:

```javascript
router.use(checkUser) // Passport Middleware. If User is authenticated, it is added to req
router.get('/locations', (req, res) => res.send(200).body({ locations: [], user: req.user }))
```

## 🗒 What to do

1. Create a new resource: `Users`
    1. Create a new `users` folder containing a user model, service and controller
        1. A `user` has a **username** and a **password**
    2. Register the `users.controller.js` in Express router (`index.js`). The controller must offer the following
       routes:
        1. Register POST `/users/register`
        2. Login POST `/users/login`
        3. Get self GET `/users/me` (implement it later, using JWT Auth)
        4. Update self PUT/PATCH `/users/me` (implement it later, using JWT Auth)
        5. Delete self DELETE `/users/me` (implement it later, using JWT Auth)
        6. Get all GET `/users` (remember to not return users passwords on this route)
2. Implement the User Registration route
    1. Ensure username is unique
    2. Hash the password with bcrypt and save it in Mongo with the username
3. Create a folder to store Passport Strategies (local and JWT strategies)
4. Implement the User Login route with `passport-local`
    1. Use a `passport-local` strategy for this, as a middleware before the **route handler**:
        1. Find the user by its username
        2. Hash the password with bcrypt and compare it with found user in Mongo (403 if not matching, Passport handles it)
    2. **Route handler**: Sign a JWT (`jsonwebtoken` package) containing the user's ID as `sub`. Use a JWT Secret from
       your `.env file`
5. Implement a JWT Middleware with a JWT Passport Strategy (`passport-jwt`)
    1. Get User from Mongo with the JWT `sub` data
6. Use the JWT middleware to protect all `/locations` routes
7. Use the JWT middleware to implement and protect the `/users/me` CRUD routes
