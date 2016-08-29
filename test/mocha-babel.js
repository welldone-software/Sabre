require('babel-register')({
  ignore: filename => {
    if (/node_modules/.test(filename)) {
      return true
    }

    return false
  },
})
