Orc Engine
=

当前版本
----------
[![build status][travis-image]][travis-url]
[![codecov.io][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[travis-image]: https://img.shields.io/travis/baka397/Orc-Engine/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/baka397/Orc-Engine
[codecov-image]: https://img.shields.io/codecov/c/github/baka397/Orc-Engine/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/baka397/Orc-Engine?branch=master
[david-image]: https://img.shields.io/david/baka397/Orc-Engine.svg?style=flat-square
[david-url]: https://david-dm.org/baka397/Orc-Engine
[node-image]: https://img.shields.io/badge/node.js-%3E=_4-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

介绍
----------
Orc Engine是一个基于[redis](http://redis.io/)的"轻量级、高扩展性、快速"推荐引擎.  
通过Orc你可以快速创建基于用户行为的内容推荐系统.

安装
----------
请确保以下依赖的版本
```
nodejs >= 4.0.0
redis >= 2.0.0
```

测试
----------
```
npm test
npm run test-cov
```

文档
----------
访问[orce.io](https://orce.io)获取最新文档.(暂未开放)

Todo list
----------
- High
    * 内置模块 - (算法测试项目:[ACGO-个性化的动漫推荐网站](https://www.acgo.club/client/))
        * 针对稀疏数据的`ItemResult`模块
        * 针对稀疏数据的`ProfileResult`模块
    * `Strategy`策略层编写:
        * 对模块调用的核心方法实现与封装
        * 测试集自动拆分与效果报告
    * 内置策略
- Middle
    * ORC开发文档 - 隶属[Orce.io官网](https://github.com/baka397/Orc-engine-website)
        * Getting Started
        * API
        * Middleware使用指南
        * Module开发指南
        * Strategy开发指南
        * Demo Sites
- Low
    * [Orce.io官网](https://github.com/baka397/Orc-engine-website)
    * [Orce.io Plugin List](https://github.com/baka397/Orc-engine-website)
    * Redis核心组件对Redis集群的改造

Changelog
----------
版本更新说明请关注[releases](https://github.com/baka397/Orc-Engine/releases)

License
----------
[MIT协议](https://opensource.org/licenses/MIT)

开发测试数据集
----------
[MovieLens](https://grouplens.org/datasets/movielens/)