const { model, Schema } = require('mongoose')

const postSchema = new Schema({
  body: String,
  username: {
    type: String,
    ref: 'User'
  },
  createdAt: Date,
  comments: [{
    body: String,
    username: { type: String, ref: 'User' },
    createdAt: String
  }],
  likes: [{
    username: { type: String, ref: 'User' },
    createdAt: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Post = model('Post', postSchema)
module.exports = Post
