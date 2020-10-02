var queue = []; // 下载队列 避免重复下载

/**
 * 下载文件
 * @param {string} url 要下载文件资源地址
 * @param {string} filename 下载文件保存的路径
 * @returns {string} 下载后的本地路径
 */
function download(url, filename) {
  return new Promise(resolve => {
    if (queue.includes(url)) return;
    queue.push(url);
    const task = plus.downloader.createDownload(
      url,
      filename ? { filename } : {},
      (download, status) => {
        queue.splice(queue.indexOf(url), 1);
        resolve(status === 200 ? download.filename : null);
      }
    );
    task.start();
  });
}

export default download;
