# imgcache

> UNIAPP APP平台上图片缓存组件
> 可兼容其他平台写法

## Install

* 在uni-app插件市场右上角选择`使用HBuilder X 导入插件`或者`下载插件ZIP`。
* 将下载解压后的`imgcache`文件夹，复制到`components`目录内。

## Usage

### vue-cli

``` Javascript
// 引入
import imgcache from '@/components/imgcache/imgcache.vue';

// 注册
components: {
  imgcache
}

// 使用
<imgcache src="https://example.com/image.png"></imgcache>
```

### HBuilder X

由于HBuilder X的[easycom](https://uniapp.dcloud.io/collocation/pages?id=easycom)，可以不用引用、注册，直接在页面中使用

``` HTML
<imgcache src="https://example.com/image.png"></imgcache>
```

## API

### Props

在 `image` 的属性在 `imgcache` 组件上是一样可以用的，这里在原有的基础上加了几个属性

| 属性名        | 类型   | 默认值 | 说明 |
| :---         | :---   | :---  | :--- |
| dir          | string | image | 缓存的文件目录（文件夹开头不能有_） |
| custom-style | object | -    | 自定义样式 |

### Events

| 属性名 | 类型        | 说明 |
| :---  | :---        | :---  |
| click | HandleEvent | 点击事件，请勿使用@tap点击事件，微信小程序无效，返回值为点击事件及参数 |

### Method

这里我写了几个方法用于处理缓存文件，可无需引入组件，而是引入 `imgcache.js`

``` Javascript
// 引入
import { getDirSize, removeDir, formatSize } from '@/components/imgcache/imgcache';
```

** getDirSize(dir) **

* 根据目录获取目录大小
* 参数：`dir` `<string>` 目录地址
* 返回：`<Promise>` 目录大小

** removeDir(dir) **

* 删除目录
* 参数：`dir` `<string>` 目录地址

** formatSize(size) **

* 格式化字节大小
* 参数：`size` `<number>` 字节大小
* 返回：`<String>` 转换后的文字
