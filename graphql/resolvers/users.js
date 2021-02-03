const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const { UserInputError } = require('apollo-server')
const { validateRegisterInput, validateLoginInput } = require('../../util/validator')

const generateToken = (user) => {
  const token = jwt.sign({
    _id: user.id,
    email: user.email,
    username: user.username
  }, process.env.JWT_SECRET, { expiresIn: '1h' })
  return token
}

module.exports = {
  Query: {
  },
  Mutation: {
    async register(_, { registerInput }) {
      // TODO: Validate user data input.
      const registerInputDataOrErrors = validateRegisterInput(registerInput)
      if(!registerInputDataOrErrors.value)
        return new UserInputError('Input Errors:', {
          errors: registerInputDataOrErrors
        })

      // TODO: Make sure user doesn't already exist.
      const { email, username, password } = registerInputDataOrErrors.value
      const user = await User.findOne({ username })
      if (user) throw new UserInputError('Username is taken.', {
        errors: {
          username: ['This username already taken']
        }
      })

      // TODO: Hash password and create an auth token.
      const newUser = new User({
        email,
        username,
        password: await bcrypt.hash(password, 12),
        createdAt: new Date().toISOString()
      })

      const res = await newUser.save()

      return {
        ...res._doc,
        _id: res.id,
        token: generateToken(res),
        createdAt: new Date(res._doc.createdAt).toISOString()
      }
    }, // End of REGISTER func
    async login(_, { username, password }) {
      const loginInputDataOrErrors = validateLoginInput({ username, password })

      if(!loginInputDataOrErrors.value) 
        return new UserInputError("Input Errors", { 
          errors: loginInputDataOrErrors        
        })

      const user = await User.findOne({ username })
      if (!user)
        return new UserInputError("Wrong credential", { 
          errors: {username: ["User not found."]}
        })

      const matchPassword = await bcrypt.compare(password, user.password)
      console.log('passowrd match:', matchPassword)

      if (!matchPassword) 
        return new UserInputError("Authenticate Failed", { 
          errors: "Wrong password." 
        })

      return ({
        ...user._doc,
        _id: user.id,
        token: generateToken(user),
        createdAt: new Date(user._doc.createdAt).toISOString()
      })
    }, // End of LOGIN func

  }
}

