<h1 align="center">🍕 eBPF Hub</h1>

## ⭐ 项目架构

使用 Next.js 框架的一个前后端混合架构 web 服务。

## 🚀 部署

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/linuxkerneltravel/ebpfs)

1. 注册 [Vercel](https://vercel.com) 账户并 Connect 仓库或点击上方按钮一键部署

2. 为 Vercel Project 添加环境变量

   | 变量名                     | 描述                            | 示例                             |
   | -------------------------- | ------------------------------- | -------------------------------- |
   | BASE_URL                   | 基本 URL                        | https://ebpfs.vercel.app         |
   | GITHUB_OAUTH_CLIENT_ID     | 用于 OAuth 登录的 Client ID     | bb288f347cbc9b96de8c             |
   | GITHUB_OAUTH_CLIENT_SECRET | 用户 OAuth 登录的 Client Secret | 9f7c87a1a5a2351687231f683445224e |
   | ALGOLIA_APPLICATION_ID     | Algolia 搜索服务应用 ID         | KFCVME50                         |
   | ALGOLIA_API_KEY            | Algolia 搜索服务 API Key        | 9f7c87a1a5a2351687231f683445224e |

## ⚠ 可能出现的问题

**本地环境测试出现多次重复请求**

1. 检查是否将逻辑代码了错误的服务侧或客户端侧

2. 逻辑代码在 render 中，当组件加载卸载重新渲染引起重复调用

3. 本地测试环境出现两次相同请求（渲染两次）

   修改 `next.config.js` 关闭 React 严格模式：

   ```js
   const nextConfig = {
     reactStrictMode: false,
   }
   ```