const files = require.context('.', false, /\.js$/)

const FiltersPlugin = {
  install(Vue) {
    files.keys().forEach(key => {
      if (key === './index.js') {
        return
      }

      const name = key.replace(/(\.\/|\.js)/g, '')

      Vue.filter(name, files(key).default)
    })
  }
}

export default FiltersPlugin
