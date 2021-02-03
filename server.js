const mongoose = require('mongoose')
const { ApolloServer, PubSub } = require('apollo-server')

require('dotenv').config()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const pubsub = new PubSub()
const PORT = process.env.PORT || 5000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
})

mongoose.Promise = require('bluebird')
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected')
    return server.listen({ port: PORT })
  })
  .then(res => {
    console.log(`Server running at ${res.url}`)
  })
  .catch(console.error)
