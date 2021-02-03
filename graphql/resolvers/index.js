const dateResolvers = require('./date')
const usersResolvers = require('./users')
const postsResolvers = require('./posts')
const commentsResolvers = require('./comments')


module.exports = {
  Date: dateResolvers.Date,
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
  },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
}
