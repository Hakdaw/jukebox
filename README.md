# Jukebox Project
### 更新时间 2022/11/23 23:00

点歌系统，由云南师大附中呈贡校区学生会科技部网络组与Hakdaw开发维护，Hakdaw开源管理团队（HOSMT）提供开源维护和支持。

## 目录说明

```
/server/ 服务端目录/
 -|cache/ 缓存目录(运行时生成)/
 --|queue.json 点歌队列缓存
 --|custom.json 歌名提交缓存
 -|config/ 配置文件目录/
 --|cookie.json 所使用的账号cookie配置
 --|user.json 用户信息配置(未启用)
 -|res/ 资源目录/
 -|api.js 第三方API调用相关模块
 -|app.js 入口文件
 -|app.json 应用信息
 -|cache.js 缓存功能模块
 -|errcode.js 错误码
 -|log.js 日志打印模块
 -|server.js 服务端核心模块
 -|utils.js 服务端工具模块

/player/ 播放端目录/
-|index.html 入口文件
-|res/ 资源目录/
```

## 启动

服务器启动详见/server/README.md

播放端启动使用浏览器打开/player/index.html（建议使用最新版Firefox）



## 警告

项目三四千行代码只有三四十行注释，不要强行理解，不要随意改看不懂的地方<br />
播放端很玄学，有时正常有时抽风<br />
Q\*音yue就是个\*\*，上线前一天寄了，干脆直接给相关代码注释了<br />
网易云也不大正常，歌曲总数返回有问题<br />

主页歌单写法很弱智，搜索结果显示歌单也很弱智，找个机会必给他重构了<br />

属于是NodeJS的练手项目，没用Express等框架，路由是switch实现的，还套了好几层，几个类之间来回横跳，很弱智，但能用<br />

NodeJS的模块不好上传，自个装一下<br />



## Problems
目前已知如下问题<br />

**1. 冲歌bug**<br />

播放端在播放到无法播放的歌曲时，会尝试重新获取，然后冲掉列表里所有已审核的歌<br />

播放端使用的Howler.js库，在播放部分VIP歌、单曲版权歌时，会拿不到链接，丢出loaderror的错误，但同时会丢出playerror的错误，loaderror与playerror的处理方法是相同的，都是或获取一首新歌，但获取新歌的函数定时器共用同一个公共变量，导致定时器指针丢失，获取到新歌后无法clear定时器，定时器快速循环冲歌。<br />

**2. 0页码bug**<br />

网易云搜索接口返回的数据中，原歌曲总数数据为空，导致页码显示0。<br />



## 开发计划

1.适配手机<br />

2.尝试修复以上bug<br />

3.尽快合法接入wyy音乐接口<br />

4.支持B站点歌，选取播放片段（Howler精灵功能）<br />

4.尝试支持分享点歌（用户直接在网易云音乐、B站等App内分享给点歌机器人QQ，服务器自动获取sid，BV号等数据完成点歌）<br />



## 声明

此项目由云南师大附中呈贡校区学生会科技部网络组与Hakdaw共同开发维护，Hakdaw Open Source Manage Temp（HOSMT，Hakdaw开源管理团队）提供开源维护和支持，**Hakdaw (c) 2022，版权所有。**<br />

***此项目仅供个人使用，禁止任何形式商用，禁止出售副本，禁止分发，禁止转授许可。***