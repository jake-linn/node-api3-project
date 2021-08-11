const express = require('express');
const User = require("./users-model")
const Post = require("../posts/posts-model")
const { validateUserId, validateUser, validatePost } = require("../middleware/middleware")


// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(users => res.json(users))
    .catch(err => next(err))
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const body = req.body;
  User.insert(body)
    .then(({id}) => {
      return User.getById(id)
    })
    .then ( user => res.status(201).json(user))
    .catch(err => next(err))
});

router.put('/:id',validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const id = req.params.id
  const body = req.body

  User.getById(id)
    .then(() => {
      return User.update(id, body)
    })
    .then(() => {
      return User.getById(id)
    })
    .then(user => res.json(user))
    .catch(err => next(err))


});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id

try {
  const id = req.params.id
  const userID = await User.getById(id)
  if(userID){
    await User.remove(id)
    res.json(userID)
    next()
  }

} catch(err){
  next(err)
}

});

router.get('/:id/posts', validateUserId,  (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id

const id = req.params.id
User.getUserPosts(id)
  .then(posts => res.json(posts))
  .catch(err => next(err))


});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
const postInfo = {...req.body, user_id: req.params.id}
Post.insert(postInfo)
  .then( post => res.status(201).json(post))
  .catch(err => next(err))

});

// do not forget to export the router

module.exports = router; 