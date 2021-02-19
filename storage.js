/**
  interface DB {
    url: string    // 网络地址（唯一）
    local: string  // 本地地址
  }
 */

class Storage {
  constructor(name) {
    this.name = name
    this.db = uni.getStorageSync(name) || []
  }
  // 获取缓存
  get storage() {
    return this.db
  }
  // 设置缓存
  set storage(data = []) {
    if (data.length) {
      uni.setStorageSync(this.name, data)
      this.db = data
    }
    return data
  }
  // 插入数据
  insert(...args) {
    const data = [...this.storage]
    args.forEach(({ url, local }) => {
      if (!url || !local) return
      const index = data.findIndex(ele => ele.url === url)
      index > -1 && data.splice(index, 1)
      data.push({ url, local })
    })
    this.setStorage(data)
    return data
  }
  // 删除数据
  delete(obj = {}) {
    const keys = Object.keys(obj)
    const storage = this.storage.filter(ele => !keys.some(k => obj[k] === ele[k]))
    this.setStorage(storage)
    return storage
  }
  // 查询数据
  select(obj = {}) {
    const keys = Object.keys(obj)
    const storage = this.storage.filter(ele => keys.every(k => obj[k] === ele[k]))
    return storage
  }
  // 清空数据
  clear() {
    this.storage = []
  }
}

export default new Storage('imgcache')
