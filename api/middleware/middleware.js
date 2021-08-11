const User = require("../users/users-model")


function logger(req, res, next) {
  
  // logs to the console the following information about each request: request method, request url, and a timestamp
  // - this middleware runs on every request made to the API

console.log(req.method, req.url, Date.now())
next()


}

 async function validateUserId(req, res, next) { 

const id = req.params.id;
  const userId = await User.getById(id)
  if(!userId){
      res.status(404).json({
        message: "user not found"
      })
    } else {
      req.user = userId
      next()
    }

}

function validateUser(req, res, next) {
  // - `validateUser` validates the `body` on a request to create or update a user
  // - if the request `body` lacks the required `name` field, respond with status `400` and `{ message: "missing required name field" }`

  const name = req.body.name;
  if(!name){
    res.status(400).json({
      message: "missing required name field"
    })
  }else{
    next()
  }

}

function validatePost(req, res, next) {
  // - `validatePost` validates the `body` on a request to create a new post
  // - if the request `body` lacks the required `text` field, respond with status `400` and `{ message: "missing required text field" }`
const text = req.body.text;
if(!text){
  res.status(400).json({
    message: "missing required text field"
  })
} else {
  next()
}

}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}