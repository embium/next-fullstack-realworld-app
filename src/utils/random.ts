function genRandomString(length: number) {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  var charLength = chars.length
  var result = ''
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength))
  }
  return result
}

export default genRandomString
