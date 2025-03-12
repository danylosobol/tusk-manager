export const CookieManager = {
  set(name, value, days = 7, path = '/') {
    let expires = ''
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = `; expires=${date.toUTCString()}`
    }
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=${path}`
  },

  get(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=')
      acc[decodeURIComponent(key)] = decodeURIComponent(value)
      return acc
    }, {})
    return cookies[name] || null
  },

  has(name) {
    return document.cookie.includes(`${encodeURIComponent(name)}=`)
  },

  delete(name, path = '/') {
    this.set(name, '', -1, path)
  },

  clear(path = '/') {
    document.cookie.split('; ').forEach((cookie) => {
      const [key] = cookie.split('=')
      this.delete(decodeURIComponent(key), path)
    })
  },
}
