/**
 * 根据目录获取目录大小
 * @param {string} dir 目录地址
 * @returns {Promise} 返回目录大小，单位字节
 */
export function getDirSize(dir) {
  return new Promise(resolve => {
    // #ifdef APP-PLUS
    plus.io.resolveLocalFileSystemURL(
      dir,
      entry => {
        entry.getMetadata(
          res => resolve(res.size || 0),
          () => resolve(0),
          true
        );
      },
      () => resolve(0)
    );
    // #endif

    // #ifndef APP-PLUS
    resolve(0);
    // #endif
  });
}

/**
 * 删除目录
 * @param {string} dir 目录地址
 */
export function removeDir(dir) {
  // #ifdef APP-PLUS
  plus.io.resolveLocalFileSystemURL(dir, entry => {
    entry.removeRecursively();
  });
  // #endif
}

/**
 * 格式化字节大小
 * @param {number} size 字节大小
 * @returns {string} 格式化后的文字
 */
export function formatSize(size) {
  const s = parseInt(size);
  if (s === 0) return '0B';
  else if (s < 1024) return s + 'B';
  else if (s < 1048576) return (s / 1024).toFixed(2) + 'KB';
  else if (s < 1073741824) return (s / 1048576).toFixed(2) + 'MB';
  else return (s / 1073741824).toFixed(2) + 'GB';
}
