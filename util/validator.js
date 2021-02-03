const { Success } = require('folktale/validation')
const {
  matches,
  notEmpty, 
  compare2Values 
} = require('./rules')

const { formatValidateError } = require('./format')

// Rules
const isUsernameValid = username => Success()
  .concat(notEmpty('username', username))
  .map(() => username)

const isEmailValid = email => Success()
  .concat(notEmpty('email', email))
  .concat(matches(
    'email', 
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    email,
    "must be a valid email address.")
  )
  .map(() => email)

const isPasswordValid = (password, confirmPassword) => Success()
  .concat(notEmpty('password', password))
  .concat(
    compare2Values('confirmPassword', password, confirmPassword, 'Password don\'t match'))
  .map(() => password)

const validateRegisterForm = data => Success()
  .concat(isEmailValid(data.email))
  .concat(isUsernameValid(data.username))
  .concat(isPasswordValid(data.password, data.confirmPassword))
  .map(() => data)

const validateLoginForm = data => Success()
  .concat(isUsernameValid(data.username))
  .concat(isPasswordValid(data.password, data.password))
  .map(() => data)


exports.validateRegisterInput = ({
  email,
  username,
  password,
  confirmPassword
}) => {
  return validateRegisterForm({ email, username, password, confirmPassword })  
    .matchWith({
      Success: (val) => val,
      Failure: ({value}) => formatValidateError(value)
    })
}

exports.validateLoginInput = ({ username, password }) => {
  return validateLoginForm({ username, password })
    .matchWith({
      Success: (val) => val,
      Failure: ({value}) => formatValidateError(value)
    })
}

exports.formatValidateError = formatValidateError
