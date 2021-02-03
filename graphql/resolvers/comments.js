const { Post } = require('../../models')
const checkAuth = require('../../util/check-auth')
const { UserInputError, AuthenticationError } = require('apollo-server')

module.exports = {
  Query: {
  },
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context)
      if(body.trim() === "") 
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        })

      const post = await Post.findById(postId)

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })
        await post.save()
        return post
      } else return new UserInputError('Post not found')
      
    }, // end of CREATECOMMENT function
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context)
      const post = await Post.findById(postId)

      if(post) {
        const commentIndex = post.comments.findIndex(c => c.id === commentId)
        if (commentIndex < 0) return new Error('comment not found')

        if(post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1)
          await post.save()
          return post
        } else return new AuthenticationError('Action not allowed')
      } else return new UserInputError('Post not found')
    }
  }
}
