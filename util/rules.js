const { Success, Failure } = require('folktale/validation')

const createError = (field, message) => [JSON.parse(`{ "${field}": "${message}" }`)]
  
const notEmpty = (field, value) => 
  value.trim() ? Success(value)
    /* else */ : Failure(createError(field, `${field} can't be empty.`))

const compare2Values = (field, valueA, valueB, message) =>
  valueA === valueB ? Success(valueA) :
    /* otherwise */   Failure(createError(field, message))

const isPasswordLongEnough = (password) =>
  password.length > 6 ? Success(password): 
    /* otherwise */     Failure(
      createError(password, 'Password must have more than 6 characters.'));

const matches = (field, regexp, value, message='') =>
  regexp.test(value) ?  Success(value) : 
    /* otherwise */     Failure(
      createError(field, message || `${field} must match ${regexp}`));

module.exports = {
  matches,
  notEmpty,
  compare2Values, 
  isPasswordLongEnough
}
