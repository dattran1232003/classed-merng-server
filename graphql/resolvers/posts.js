const { Post } = require('../../models')
const checkAuth = require('../../util/check-auth')
const { AuthenticationError } = require('apollo-server')

module.exports = {
  Query: {
    async getPosts() {
      console.log('getPosts')
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 })
        return posts
      } catch(error){ throw new Error(error) }
    }, // End of GETPOSTS function
    async getPost(_, { postId }) {
      console.log('getPost')
      const post = await Post.findById(postId)
      if(!post)
        return new Error('Post not found')
      return post
    }
  },
  Mutation: {
    async createPost(_, { body }, context){
      console.log('createPost')
      if (body.trim() === '') 
        return new Error('body cannot be empty')
      const user = checkAuth(context)

      const newPost = new Post({
        body,
        user: user._id,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      return newPost.save()
        .then(post => {
          context.pubsub.publish('NEW_POST', {
            newPost: post
          })

          return post
        })
        .catch(console.error)

    }, // End of CREATEPOST function
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context)

      try {
        const post = await Post.findById(postId)
        if (user.username === post?.username) {
          await post.delete()
          return `Post ${post.id} deleted successfully`
        }
        return new AuthenticationError('Action not allowed')
      } catch(e) {
        throw new Error(e)

      }

    }, // End of DELETEPOST function
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context)

      const post = await Post.findById(postId)
      if(post) {
        if(post.likes.find(like => like.username === username)){
          // Post already likes, unlike it
          post.likes = post.likes.filter(like => like.username !== username)
        } else {
          // If not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          })
        }
        await post.save()
        return post
      } else  return new Error('Post not found')
    }, // End of LIKEPOST function
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}
