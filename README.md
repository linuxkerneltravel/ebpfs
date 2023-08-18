<h1 align="center">🍕 eBPF Hub</h1>

## ⭐ 项目架构

使用 Next.js 框架的一个前后端混合架构 web 服务。

## 🚀 部署

[![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/linuxkerneltravel/ebpfs)

1. 注册 [Vercel](https://vercel.com) 账户并 Connect 仓库或点击上方按钮一键部署

2. 为 Vercel Project 添加**必要的**环境变量

   | 变量名                     | 描述                            | 示例                             |
   | -------------------------- | ------------------------------- | -------------------------------- |
   | BASE_URL                   | 基本 URL                        | https://ebpfs.vercel.app         |
   | GITHUB_OAUTH_CLIENT_ID     | 用于 OAuth 登录的 Client ID     | bb288f347cbc9b96de8c             |
   | GITHUB_OAUTH_CLIENT_SECRET | 用户 OAuth 登录的 Client Secret | 9f7c87a1a5a2351687231f683445224e |
   | ALGOLIA_APPLICATION_ID     | Algolia 搜索服务应用 ID         | KFCVME50                         |
   | ALGOLIA_API_KEY            | Algolia 搜索服务 API Key        | 9f7c87a1a5a2351687231f683445224e |

3. **可选性**功能的环境变量

   | 变量名                | 描述                        | 示例                             |
   | --------------------- | --------------------------- | -------------------------------- |
   | EMAIL_SENDER          | 邮箱地址                    | ebpfs@ebpfs.vercel.app           |
   | EMAIL_SENDER_PASSWORD | 邮箱密码                    | 9f7c87a1a5a2351687231f683445224e |
   | EMAIL_SMTP_HOST       | SMTP 服务主机               | mail.qq.com                      |
   | EMAIL_SMTP_PORT       | SMTP 服务端口               | 445                              |
   | EMAIL_SMTP_SECURE     | 是否使用 SSL / TLS 加密会话 | true / false                     |

## 🤖 API 接口

### 公共数据结构

全部的消息均为 json 格式数据且具有 `status` 状态码 `message` 信息 `data` 数据

如下：

```js
{
  "status": 200,
  "message": "success",
  "data": {}
}
```

### 登录接口

| 请求类型 | 接口       | 功能                             | 鉴权     |
| -------- | ---------- | -------------------------------- | -------- |
| GET      | /api/oauth | 获取 Github OAuth 登录 URL       | 无需鉴权 |
| POST     | /api/login | 接受 Github OAuth 回调的回调接口 | 无需鉴权 |

### 功能接口

| 请求类型 | 接口            | 功能                             | 鉴权                   |
| -------- | --------------- | -------------------------------- | ---------------------- |
| GET      | /api/search     | 检索已经注册的 ebpf 程序包       | 无需鉴权               |
| GET      | /api/account    | 获取账号和账号所建立的程序包仓库 | Authorization: {TOKEN} |
| GET      | /api/repository | 获取仓库详细信息                 | 无需鉴权               |
| POST     | /api/repository | 提交仓库详细信息                 | Authorization: {TOKEN} |

**GET /api/search**

使用 GET 并在 `query` 携带 `query={QUERY}` 参数请求服务侧获取符合搜索条件的程序包。

该接口使用 Algolia 搜索服务，搜索结果为 Algolia 回调二次封装

示例请求：

```js
GET /api/search?query=ebpf
```

示例返回：

<details>

```js
{
  "status": 200,
  "message": "OK",
  "data": [
    {
      "id": "d564ffba-686b-42b6-ac04-dc89f886ce44",
      "url": "https://github.com/linuxkerneltravel/lmp/tree/develop/eBPF_Hub/bashreadline",
      "organization": "lmp",
      "project": "bashreadline",
      "readme": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
      "content": "---layout: posttitle: bootstrapdate: 2022-10-10 16:18category: bpftoolsauthor: yunwei37tags: [bpftools, examples, uprobe, perf event]summary: an example of a simple (but realistic) BPF application prints bash commands from all running bash shells on the system. ---This prints bash commands from all running bash shells on the system. ## System requirements:- Linux kernel > 5.5- Eunomia's [ecli](https://github.com/eunomia-bpf/eunomia-bpf/tree/master/ecli) installed## Run- Compile:  ```shell  docker run -it -v `pwd`/:/src/ yunwei37/ebpm:latest  ```  or  ```shell  ecc bashreadline.bpf.c bashreadline.h  ```- Run:  ```console  $ sudo ./ecli run eunomia-bpf/examples/bpftools/bootstrap/package.json  TIME      PID    STR  11:17:34  28796  whoami  11:17:41  28796  ps -ef  11:17:51  28796  echo \"Hello eBPF!\"  ```## details in bcc```Demonstrations of bashreadline, the Linux eBPF/bcc version.This prints bash commands from all running bash shells on the system. Forexample:# ./bashreadlineTIME      PID    COMMAND05:28:25  21176  ls -l05:28:28  21176  date05:28:35  21176  echo hello world05:28:43  21176  foo this command failed05:28:45  21176  df -h05:29:04  3059   echo another shell05:29:13  21176  echo first shell againWhen running the script on Arch Linux, you may need to specify the locationof libreadline.so library:# ./bashreadline -s /lib/libreadline.soTIME      PID    COMMAND11:17:34  28796  whoami11:17:41  28796  ps -ef11:17:51  28796  echo \"Hello eBPF!\"The entered command may fail. This is just showing what command lines wereentered interactively for bash to process.It works by tracing the return of the readline() function using uprobes(specifically a uretprobe).```",
      "author": [
        "yunwei37"
      ],
      "tags": [
        "bpftools",
        "examples",
        "uprobe",
        "perf event"
      ],
      "objectID": "d564ffba-686b-42b6-ac04-dc89f886ce44",
      "_highlightResult": {
        "id": {
          "value": "d564ffba-686b-42b6-ac04-dc89f886ce44",
          "matchLevel": "none",
          "matchedWords": []
        },
        "url": {
          "value": "https://github.com/linuxkerneltravel/lmp/tree/develop/<em>eBPF</em>_Hub/bashreadline",
          "matchLevel": "full",
          "fullyHighlighted": false,
          "matchedWords": [
            "ebpf"
          ]
        },
        "organization": {
          "value": "lmp",
          "matchLevel": "none",
          "matchedWords": []
        },
        "project": {
          "value": "bashreadline",
          "matchLevel": "none",
          "matchedWords": []
        },
        "readme": {
          "value": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/<em>eBPF</em>_Hub/bashreadline/README.md",
          "matchLevel": "full",
          "fullyHighlighted": false,
          "matchedWords": [
            "ebpf"
          ]
        },
        "content": {
          "value": "---layout: posttitle: bootstrapdate: 2022-10-10 16:18category: bpftoolsauthor: yunwei37tags: [bpftools, examples, uprobe, perf event]summary: an example of a simple (but realistic) BPF application prints bash commands from all running bash shells on the system. ---This prints bash commands from all running bash shells on the system. ## System requirements:- Linux kernel > 5.5- Eunomia's [ecli](https://github.com/eunomia-bpf/eunomia-bpf/tree/master/ecli) installed## Run- Compile:  ```shell  docker run -it -v `pwd`/:/src/ yunwei37/ebpm:latest  ```  or  ```shell  ecc bashreadline.bpf.c bashreadline.h  ```- Run:  ```console  $ sudo ./ecli run eunomia-bpf/examples/bpftools/bootstrap/package.json  TIME      PID    STR  11:17:34  28796  whoami  11:17:41  28796  ps -ef  11:17:51  28796  echo \"Hello <em>eBPF</em>!\"  ```## details in bcc```Demonstrations of bashreadline, the Linux <em>eBPF</em>/bcc version.This prints bash commands from all running bash shells on the system. Forexample:# ./bashreadlineTIME      PID    COMMAND05:28:25  21176  ls -l05:28:28  21176  date05:28:35  21176  echo hello world05:28:43  21176  foo this command failed05:28:45  21176  df -h05:29:04  3059   echo another shell05:29:13  21176  echo first shell againWhen running the script on Arch Linux, you may need to specify the locationof libreadline.so library:# ./bashreadline -s /lib/libreadline.soTIME      PID    COMMAND11:17:34  28796  whoami11:17:41  28796  ps -ef11:17:51  28796  echo \"Hello <em>eBPF</em>!\"The entered command may fail. This is just showing what command lines wereentered interactively for bash to process.It works by tracing the return of the readline() function using uprobes(specifically a uretprobe).```",
          "matchLevel": "full",
          "fullyHighlighted": false,
          "matchedWords": [
            "ebpf"
          ]
        },
        "author": [
          {
            "value": "yunwei37",
            "matchLevel": "none",
            "matchedWords": []
          }
        ],
        "tags": [
          {
            "value": "bpftools",
            "matchLevel": "none",
            "matchedWords": []
          },
          {
            "value": "examples",
            "matchLevel": "none",
            "matchedWords": []
          },
          {
            "value": "uprobe",
            "matchLevel": "none",
            "matchedWords": []
          },
          {
            "value": "perf event",
            "matchLevel": "none",
            "matchedWords": []
          }
        ]
      }
    }
  ]
}
```

</details>


**GET /api/account**

请求接口将获取到账号的基本信息（头像、OPENID）所创建的程序包仓库和 TOKEN 信息。

账户信息将从 TOKEN 读取，无需携带参数。

示例请求：

```js
GET /api/account
{
    Authorization: c040861a-3af9-6c74-9ecb-d4f2eecb0779
}
```

示例返回：

```js
{
    "status": 200,
    "message": "success.",
    "data": {
        "id": "befd65a6-d5a1-4027-8635-61ac5a465d50",
        "account": {},
        "repositories": {}
    }
}
```

**GET /api/repository**

根据 `query` 的 `id={ID}` 请求仓库的详细信息。

示例请求：

```
GET /api/repository?id=d564ffba-686b-42b6-ac04-dc89f886ce44
```

示例返回：

```js
{
    "status": 200,
    "message": "OK",
    "data": {
        "repository": [
            {
                "id": "d564ffba-686b-42b6-ac04-dc89f886ce44",
                "account": "befd65a6-d5a1-4027-8635-61ac5a465d50",
                "update": "1691702267986",
                "organization": "lmp",
                "project": "bashreadline",
                "version": "1.0.0",
                "readme": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
                "type": "wasm",
                "repository": "https://github.com/linuxkerneltravel/lmp/tree/develop/eBPF_Hub/bashreadline",
                "entry": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
                "author": "{\"yunwei37\"}",
                "tags": "{\"bpftools\",\"examples\",\"uprobe\",\"perf event\"}",
                "created": "1691702269751"
            }
        ]
    }
}
```

**POST /api/repository**

更新或创建新的程序包仓库。

示例请求：

```js
POST /api/repository
{
    Authorization: c040861a-3af9-6c74-9ecb-d4f2eecb0779
}
{
  "update": "1691702267986",
  "organization": "lmp",
  "project": "bashreadline",
  "version": "1.0.0",
  "repository": "https://github.com/linuxkerneltravel/lmp/tree/develop/eBPF_Hub/bashreadline",
  "readme": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
  "type": "wasm",
  "entry": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
  "author": [
    "yunwei37"
  ],
  "tags": [
    "bpftools",
    "examples",
    "uprobe",
    "perf event"
  ]
}
```

示例返回：

```js
{
    "status": 200,
    "message": "OK",
    "data": {
        "id": "d564ffba-686b-42b6-ac04-dc89f886ce44",
        "account": "befd65a6-d5a1-4027-8635-61ac5a465d50",
        "created": "1691702269751",
        "update": "1691702267986",
        "organization": "lmp",
        "project": "bashreadline",
        "version": "1.0.0",
        "readme": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
        "type": "wasm",
        "repository": "https://github.com/linuxkerneltravel/lmp/tree/develop/eBPF_Hub/bashreadline",
        "entry": "https://raw.githubusercontent.com/linuxkerneltravel/lmp/develop/eBPF_Hub/bashreadline/README.md",
        "author": [
            "yunwei37"
        ],
        "tags": [
            "bpftools",
            "examples",
            "uprobe",
            "perf event"
        ]
    }
}
```

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