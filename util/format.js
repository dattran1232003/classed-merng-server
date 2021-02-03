const R = require('ramda')

exports.formatValidateError = R.reduce((accum, current) => {
  const key = Object.keys(current)[0]
  const value = Object.values(current)[0]
  const sameKeyDifferenceValue = [...(accum[key] || []), value]
  return R.assoc(key, [...sameKeyDifferenceValue], accum)
}, {})
