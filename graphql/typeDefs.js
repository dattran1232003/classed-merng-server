const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date

  input RegisterInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }

  type Post {
    _id: ID!
    user: ID!
    body: String!
    likes: [Like]!
    createdAt: Date!
    username: String!
    comments: [Comment]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    _id: ID!
    createdAt: String!
    username: String!
    body: String!

  }

  type Like {
    _id: ID!
    createdAt: String!
    username: String!
  }

  type User {
    _id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`

