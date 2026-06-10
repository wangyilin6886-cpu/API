# 部署指南 — superx-id.com

本项目 = **Vite + React 前端** + **Vercel Serverless 后端**(`api/`)+ **Neon Postgres** + **Polar 支付**。
部署分支:`newbranch-superx`。仓库:`wangyilin6886-cpu/API`。

---

## 0. 你需要先准备的账号

| 账号 | 用途 | 地址 |
|---|---|---|
| Vercel | 托管前端 + Serverless 函数 | https://vercel.com |
| Neon | Postgres 数据库 | https://console.neon.tech |
| Polar | 信用卡充值 | https://polar.sh |
| DeepSeek | 站内聊天机器人 | https://platform.deepseek.com |
| 上游 LLM(“B”) | 真实模型密钥,代理转发用 | 你的供应商 |
| 域名 | superx-id.com | 你的注册商 |

## 环境变量总表(共 7 个)

| 变量 | 用途 | 从哪拿 / 示例 |
|---|---|---|
| `DATABASE_URL` | 连接 Neon | Neon 连接串(带 `?sslmode=require`) |
| `JWT_SECRET` | 登录令牌签名 | 自己生成:`openssl rand -base64 32` |
| `B_API_KEY` | 上游真实密钥(代理把用户的 `ek-` 密钥换成它) | 你的上游供应商 |
| `DEEPSEEK_API_KEY` | 站内聊天机器人(后端 `/api/chat`) | platform.deepseek.com |
| `POLAR_ACCESS_TOKEN` | 创建支付会话 | Polar → Settings → Developers(`polar_oat_...`) |
| `POLAR_WEBHOOK_SECRET` | 校验充值回调签名 | 创建 Webhook 后 Polar 给(第 4 步) |
| `POLAR_API_BASE` | Polar 接口地址 | 正式 `https://api.polar.sh`;沙箱 `https://sandbox-api.polar.sh` |

> ⚠️ `.env.example` 里的 `VITE_DEEPSEEK_API_KEY` **代码里没用到,可以不配**。

---

## ⚠️ 部署前必改的 2 处硬编码

这两处是旧账号的值,不改会导致功能失败:

1. **Polar 商品 ID** — `api/checkout.ts` 第 8 行
   ```js
   starter: { productId: '4aaa2c61-0dfb-444b-90b0-bf5c138df236', label: 'Starter Pack', usd: 10 },
   ```
   把 `productId` 换成**你自己 Polar 账号里创建的充值商品 ID**(见第 4 步)。否则下单会报“商品不存在”。

2. **DeepSeek 兜底密钥** — `api/chat.ts` 第 68 行有一行写死的旧密钥。
   只要在 Vercel 设了 `DEEPSEEK_API_KEY`,运行时就会用你的;建议把那行兜底删掉,避免泄露。

---

## 1. 建数据库(Neon)+ 建表

1. 登录 https://console.neon.tech → **Create Project**(地区建议选离用户近的,如 `Singapore / ap-southeast-1`)。
2. 创建后页面会给 **Connection string**,优先选 **Pooled connection**(host 带 `-pooler`),形如:
   ```
   postgresql://USER:PASSWORD@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
   这就是 `DATABASE_URL`。
3. 建表(会按 `db/schema.ts` 创建 4 张表:`users` / `api_keys` / `usage_logs` / `transactions`):
   ```bash
   echo 'DATABASE_URL=粘贴你的连接串' > .env.local
   npm install
   npm run db:push
   ```
   看到 4 张表创建成功即可。
   > 提示:Vercel 有官方 Neon 集成(Vercel → Integrations → Neon),装上会自动把 `DATABASE_URL` 注入项目,省去手填。

## 2. 新建 Vercel 项目

1. https://vercel.com → 用 GitHub 登录 → **Add New → Project** → 找到 `wangyilin6886-cpu/API` → **Import**。
2. **关键:设生产分支**。仓库默认分支是旧的,导入后到
   **Settings → Git → Production Branch** 改成 **`newbranch-superx`**,保存。
3. 构建设置(一般自动识别,确认即可):
   - Framework Preset:**Vite**
   - Build Command:`npm run build`
   - Output Directory:`dist`
   - Install Command:`npm install`
4. **Settings → Environment Variables**,把上面 7 个变量都加上(Environment 选 **Production**,最好也勾 Preview)。
5. **Deployments** → 触发一次部署(改了生产分支后,push 任意提交或点 **Redeploy**)。
6. 先用 Vercel 给的 `xxx.vercel.app` 地址测试能打开,再绑域名。
   > 加/改环境变量后**必须重新部署**才生效。

## 3. 绑定域名 superx-id.com

1. Vercel → 项目 → **Settings → Domains** → 输入 `superx-id.com` → **Add**。
2. 按 Vercel 提示,在你的域名注册商处加 DNS:
   - 根域名 `superx-id.com` → **A 记录** → `76.76.21.21`
   - `www.superx-id.com`(可选)→ **CNAME** → `cname.vercel-dns.com`
3. DNS 生效后(几分钟到几小时),Vercel 自动签发 HTTPS 证书。
4. 建议在 Domains 里把 `superx-id.com` 设为主域名,`www` 跳转到它。

## 4. 配置 Polar 充值

**A. 建商品**
1. Polar 后台 → **Products** → 新建一个充值商品(如 “Starter Pack”,一次性 $10)。
2. 复制它的 **Product ID** → 替换 `api/checkout.ts` 第 8 行的 `productId`(见上面“必改项 1”)→ 提交推送。

**B. 建 Webhook**
1. Polar → **Settings → Webhooks → Add Endpoint**
2. URL 填:`https://superx-id.com/api/webhooks/polar`
3. 订阅事件:勾选 **`order.paid`**(本项目只认这个来加余额)。
4. 复制它生成的 **Webhook Secret** → 填到 Vercel 的 `POLAR_WEBHOOK_SECRET` → 重新部署。

**C. Access Token**
- Polar → **Settings → Developers** → 创建 Organization Access Token → 填 `POLAR_ACCESS_TOKEN`。
- 测试期可先用沙箱:`POLAR_API_BASE=https://sandbox-api.polar.sh`(商品/Token/Webhook 都要在沙箱里建)。

> 充值逻辑:用户点充值 → `api/checkout.ts` 创建 Polar Checkout → 付款成功 → Polar 回调 `order.paid` →
> `api/webhooks/polar.ts` 按订单金额给用户加余额(用 `polar_order_id` 去重,重复回调不会重复加钱)。

## 5. 验收清单

1. 打开 `https://superx-id.com` → 企业站正常显示。
2. 点导航 **AI Token** → 站内跳到 `/superapi` 中转站页面。
3. 注册一个账号 → 刷新仍在(说明数据库通了)。
4. 登录 → 生成 API 密钥(`ek-...`)。
5. 充值 → 跳转 Polar 付款(沙箱用测试卡)→ 回到 Profile,余额增加(说明 Webhook 通了)。
6. 用密钥调接口:
   ```bash
   curl https://superx-id.com/v1/chat/completions \
     -H "Authorization: Bearer ek-你的密钥" \
     -H "Content-Type: application/json" \
     -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"hi"}]}'
   ```

## 6. 常见问题排查

| 现象 | 多半原因 |
|---|---|
| 打开就白屏 / 构建失败 | 看 Vercel **Build Logs**;本地先 `npm run build` 复现 |
| `/api/*` 报 500 | 缺环境变量(`DATABASE_URL`/`JWT_SECRET`),看 Vercel **Functions Logs** |
| 注册/登录失败 | `JWT_SECRET` 没设,或没跑 `npm run db:push` 建表 |
| 充值不到账 | Webhook 地址/密钥不对,或没订阅 `order.paid`;看 Polar **Webhook Delivery** 日志 |
| 下单报“商品不存在” | `api/checkout.ts` 的 `productId` 还是旧的,没换成你自己的 |
| 模型调用 401/余额不足 | 上游 `B_API_KEY` 没设,或账户余额为 0 |
