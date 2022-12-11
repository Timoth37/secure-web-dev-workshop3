const canAccess = (allowedRoles = []) => (req, res, next) =>{
    if(!allowedRoles || allowedRoles.length===0){
        return next()
    }
    if(!req.user){
        return res.status(401).send()
    }
    if(!req.user.role || !allowedRoles.includes(req.user.role)){
        return res.status(403).send()
    }
    return next()
}
module.exports = {canAccess}