# Cherry USB Configurator

Cherry USB Configurator 是一个简单的易于上手的用于生成 USB 描述符的图形化配置工具.

## 功能简介

Cherry USB Configurator 基于Electron11 + Vue3.2 + Vite2 + TypeScript开发。 
在Cherry USB Configurator里USB描述符被分割成了两种文件
一种是chrybase工程文件, 包含设备描述符、配置描述符和多组功能描述符的配置
另一种是chry文件, 包含了一组功能的接口关联描述符, 接口描述符,  类特定描述符, 端点描述符的配置
参考 test/demo文件内容

Cherry USB Configurator 预计实现一下功能:
- [x] 支持 USB2.0 全速和高速设备描述符配置
- [x] 支持设备描述符生成
- [x] 支持配置描述符生成
- [x] 支持字符串描述符生成
- [x] 支持接口描述符生成
- [x] 支持接口关联描述符生成
- [x] 支持端点描述符生成
- [x] 支持 HID 类描述符生成
- [x] 支持 MSC 类描述符生成
- [x] 支持 CDC ACM 类描述符生成
- [ ] 支持 UAC 1.0 描述符生成
- [ ] 支持 UAC 2.0 描述符生成
- [ ] 支持 UVC 描述符生成
- [ ] 支持多组配置描述符生成



<br><br>

## 构建

``` bash

# python 2.7
# electron 11.4.12
# nodejs 14.18.0
# vue 3.2.29
# vite ^2.7.13

# install dependencies~
yarn

# reinstall dependencies~
rm -rf node_modules
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build

```
<br><br>