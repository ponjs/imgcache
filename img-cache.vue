<template>
  <image
    class="img-cache"
    :src="resource"
    :mode="mode"
    :lazy-load="lazyLoad"
    :fade-show="fadeShow"
    :webp="webp"
    :show-menu-by-longpress="showMenuByLongpress"
    :style="style"
    @tap="fnEvent('click', $event)"
    @error="fnEvent('error', $event)"
    @load="fnEvent('load', $event)"
  >
  </image>
</template>

<script>
// #ifdef APP-PLUS
import path from 'path';
import storage from './storage';
import download from './download';
import { resolveFile } from './index';
// #endif

/**
 * ImgCache 图片缓存
 * @description APP端图片缓存
 * @tutorial https://ext.dcloud.net.cn/plugin?id=2515
 * @property {string} src 图片资源地址
 * @property {string} mode 图片裁剪、缩放的模式
 * @property {boolean} lazyLoad 是否图片懒加载
 * @property {boolean} fade-show 图片显示动画效果
 * @property {boolean} webp 默认不解析 webP 格式，只支持网络资源
 * @property {boolean} show-menu-by-longpress 开启长按图片显示识别小程序码菜单
 * @property {string} dir 缓存的文件目录（文件夹开头不能有_）
 * @property {string} width 宽度，单位任意，如果为数值，则为 rpx 单位
 * @property {string} height 高度，单位任意，如果为数值，则为 rpx 单位
 * @property {object} custom-style 自定义样式
 * @event {Function} click 点击图片
 * @event {Function} error 错误发生
 * @event {Function} load 图片载入完毕
 * @example <img-cache src="https://example.com/image.png"></img-cache>
 */
export default {
  name: 'ImgCache',
  props: {
    src: {
      type: String
    },
    mode: {
      type: String,
      default: 'scaleToFill'
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    fadeShow: {
      type: Boolean,
      default: true
    },
    webp: {
      type: Boolean,
      default: false
    },
    showMenuByLongpress: {
      type: Boolean,
      default: false
    },
    dir: {
      type: String,
      default: 'imgcache'
    },
    width: {
      type: [String, Number]
    },
    height: {
      type: [String, Number]
    },
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      resource: ''
    };
  },
  computed: {
    style() {
      return {
        width: this.addUnit(this.width),
        height: this.addUnit(this.height),
        ...this.customStyle
      };
    }
  },
  created() {
    // #ifdef APP-PLUS
    this.init();
    // #endif

    // #ifndef APP-PLUS
    this.setSrc();
    // #endif
  },
  methods: {
    async init() {
      if (!/^https?:\/\//.test(this.src)) return this.setSrc(); // 判断是否网络地址

      const [select] = storage.select({ url: this.src }); // 查询缓存是否存在

      if (select) {
        const path = select.local;
        if (await resolveFile(path)) return this.setSrc(path); // 判断本地文件是否存在 如果存在则显示本地文件
        storage.delete(select); // 如果本地文件不存在则删除缓存数据
      }
      this.setSrc();

      const local = await download(this.src, this.filename()); // 下载文件
      if (local) storage.insert({ url: this.src, local }); // 缓存数据
    },
    // 生成随机文件名后的路径
    filename() {
      const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let random = '';
      for (let i = 0; i < 4; i++) {
        const index = parseInt(Math.random() * CHARS.length);
        random += CHARS[index];
      }

      const dir = this.dir.replace(/(^\/)|(\/$)/g, '');
      const name = Date.now() + random + path.extname(this.src);

      return `_doc/${dir}/${name}`;
    },
    // 发送事件
    fnEvent(emit, event) {
      this.$emit(emit, event);
    },
    // 设置图片资源地址
    setSrc(src) {
      this.resource = src || this.src;
    },
    // 添加单位，如果为数值则为rpx单位，否则直接返回
    addUnit(value) {
      value = String(value ?? '');
      return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value) ? `${value}rpx` : value;
    }
  }
};
</script>

<style scoped>
.img-cache {
  will-change: transform;
}
</style>
