# 急诊临床信息系统

麦迪斯顿医疗科技有限公司急诊临床信息系统，基于ant Design Vue + vue + axios + vuex + vue-router进行开发，如有高频问题可以反馈，会逐步改进二开组件库 medical-ui。

****

## 目录
- [急诊临床信息系统](#急诊临床信息系统)
  - [目录](#目录)
    - [组件文档](#组件文档)
    - [环境和依赖](#环境和依赖)
    - [代码拉取](#代码拉取)
    - [代码提交](#代码提交)

### 组件文档
（龟速补全）

|#|类型|地址|
|---|----|-----|
|1|`[二开文档]](https://medical-ui.pages.dev)`|[二开文档](http://192.168.0.128)|
|2|`[结合参考][ant design vue] `|[结合参考](https://www.antdv.com/docs/vue/introduce-cn) |
|2|`[结合参考][ant design vue pro] `|[结合参考](https://pro.antdv.com/) |

### 环境和依赖
- node (建议使用[nvm](https://github.com/coreybutler/nvm-windows/releases)去安装)
- 使用管理员权限启动cmd！！ 使用管理员权限启动cmd！！
```
nvm install 14.17.6

nvm use 14.17.6

```
- 查看安装是否成功
```
node -v

npm -v
```
- 换源
安装失败考虑更换源
```
1.临时使用
npm --registry https://registry.npm.taobao.org install

2.持久使用
npm config set registry https://registry.npm.taobao.org

3.通过cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
- yarn (可选)
```
npm install --global yarn
```

### 代码拉取

- 拉取项目代码
```bash
git clone git@192.168.0.123:webui/pre-exam.git
cd pre-exam

or

http://192.168.0.123:10000/webui/pre-exam.git
cd pre-exam

```

- 安装依赖
```
yarn install

or

npm install
```

- 开发模式运行
```
yarn  dev

or

npm run dev
```

- 编译项目
```
yarn  build

or

npm run build
```

- 代码格式化（提交前代码前请执行）
```
yarn run lint
```

### 代码提交
> git提交建议使用 git cz 代替 git commit -m msg
```
yarn global add commitizen

or

npm install commitizen -g
```

> 建立自己的开发分支，后merge提交合入代码;

```
git status

git add .

git cz

git push

```
