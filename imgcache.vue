<template>
	<image
		class="img-cache"
		:src="resource"
		:mode="mode"
		:lazy-load="lazyLoad"
    :fade-show="fadeShow"
    :webp="webp"
    :show-menu-by-longpress="showMenuByLongpress"
		:style="customStyle"
    @tap.stop="fnEvent('click', $event)"
    @error="fnEvent('error', $event)"
    @load="fnEvent('load', $event)">
	</image>
</template>

<script>
/**
 * imgcache 图片缓存
 * @description APP端图片缓存
 * @property {string} src 图片资源地址
 * @property {string} mode 图片裁剪、缩放的模式
 * @property {boolean} lazyLoad 是否图片懒加载
 * @property {boolean} fade-show 图片显示动画效果
 * @property {boolean} webp 默认不解析 webP 格式，只支持网络资源
 * @property {boolean} show-menu-by-longpress 开启长按图片显示识别小程序码菜单
 * @property {string} dir 缓存的文件目录（文件夹开头不能有_）
 * @property {object} custom-style 自定义样式
 * @event {Function} click 点击
 * @event {Function} error 错误发生
 * @event {Function} load 图片载入完毕
 */
export default {
	props: {
    // 图片资源地址
		src: {
			type: String
		},
    // 图片裁剪、缩放的模式
		mode: {
      type: String,
      default: 'scaleToFill'
		},
    // 图片懒加载。只针对page与scroll-view下的image有效（微信小程序、App、百度小程序、字节跳动小程序）
		lazyLoad: {
			type: Boolean,
			default: false
    },
    // 图片显示动画效果（仅App-nvue 2.3.4+ Android有效）
    fadeShow: {
      type: Boolean,
      default: true
    },
    // 默认不解析 webP 格式，只支持网络资源（微信小程序2.9.0）
    webp: {
      type: Boolean,
      default: false
    },
    // 开启长按图片显示识别小程序码菜单（微信小程序2.7.0）
    showMenuByLongpress: {
      type: Boolean,
      default: false
    },
    // 缓存的文件目录（文件夹开头不能有_）
		dir: {
			type: String,
			default: 'image'
		},
    // 自定义样式
		customStyle: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			localFile: null,    // 本地文件
      localPath: ''       // 根据 src 和 dir 拼接处理的本地地址
		};
	},
	computed: {
		resource() {
			return this.localFile || this.src;
		}
	},
	created() {
		// #ifdef APP-PLUS
    this.localPath = this.getLocalPath();
		this.init();
		// #endif
	},
	methods: {
		async init() {
			const cache = await this.getCache();
			// this.localFile = cache || await this.downloadFile();
      if (cache) this.localFile = cache;
      else this.downloadFile();
		},
    // 下载文件
		downloadFile() {
			return new Promise(resolve => {
				const task = plus.downloader.createDownload(this.src, {
          filename: this.localPath
				}, (download, status) => {
					if (status === 200) {
						resolve(download.filename);
					} else {
						resolve(null);
					}
				});
				task.start();
			})
		},
		// 获取缓存
		getCache() {
			return new Promise(resolve => {
				plus.io.resolveLocalFileSystemURL(this.localPath, entry => {
					resolve(this.localPath);
				}, (e) => {
					resolve(null);
				});
			});
		},
    // 获取本地路径
    getLocalPath() {
      const name = this.src.substring(this.src.lastIndexOf('/') + 1);
      const path = this.dir.replace(/(^\/)|(\/$)/g, '');
      return `_doc/${path ? path + '/' : '' }${name}`;
    },
    // 发送事件
    fnEvent(emit, event) {
      this.$emit(emit, event);
    }
	}
}
</script>
