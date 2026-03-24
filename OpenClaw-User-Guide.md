# OpenClaw 用户使用指导文档

## 目录

1. [概述](#概述)
2. [快速开始](#快速开始)
3. [安装与环境准备](#安装与环境准备)
4. [基本配置](#基本配置)
5. [启动与管理 Gateway](#启动与管理-gateway)
6. [Web Channel 使用](#web-channel-使用)
7. [Control UI 操作](#control-ui-操作)
8. [常用命令参考](#常用命令参考)
9. [故障排除](#故障排除)
10. [最佳实践](#最佳实践)

---

## 概述

OpenClaw 是一个多平台消息网关系统，支持 WhatsApp、Telegram、Discord 等平台的消息聚合和管理。主要功能包括：

- **多平台消息聚合**：统一管理多个聊天平台的消息
- **Web Channel 支持**：通过 WebSocket 提供实时消息传输
- **Control UI**：图形化控制面板管理网关和连接
- **插件系统**：支持自定义扩展功能
- **安全认证**：基于 token 的身份验证机制

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd openclaw
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 构建项目

```bash
pnpm build
```

### 4. 启动 Gateway

```bash
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

### 5. 打开 Control UI

```bash
pnpm openclaw dashboard
```

现在你可以在浏览器中访问 `http://127.0.0.1:18789` 来管理你的 OpenClaw 实例。

---

## 安装与环境准备

### 系统要求

- **Node.js**: >= 22.x
- **pnpm**: >= 8.x
- **操作系统**: macOS, Linux, Windows

### 环境检查

```bash
# 检查 Node.js 版本
node --version

# 检查 pnpm 版本
pnpm --version

# 如果未安装 pnpm
npm install -g pnpm
```

### 项目初始化

```bash
# 克隆项目后进入目录
cd openclaw

# 安装所有依赖（包括工作区）
pnpm install

# 构建项目
pnpm build
```

---

## 基本配置

### 配置文件位置

主要配置文件在项目根目录：

- `package.json` - 项目元数据和脚本
- `tsconfig.json` - TypeScript 配置
- `src/config/` - 应用配置文件

### Gateway 认证 Token

OpenClaw 使用 token 进行安全认证：

#### 生成新 Token

```bash
# 方法1：通过环境变量
export OPENCLAW_GATEWAY_TOKEN=$(openssl rand -hex 32)
pnpm openclaw gateway run --bind loopback --port 18789 --force

# 方法2：使用 CLI 自动生成（推荐）
pnpm openclaw dashboard
# CLI 会自动生成 token 并在浏览器中打开带认证的 URL
```

#### 查看当前 Token

```bash
pnpm openclaw config get gateway.auth.token
```

### 网络绑定配置

```bash
# 仅本地访问（推荐开发环境）
pnpm openclaw gateway run --bind loopback --port 18789

# 指定端口
pnpm openclaw gateway run --bind loopback --port 8080

# 强制启动（覆盖现有进程）
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

---

## 启动与管理 Gateway

### 基本启动命令

```bash
# 标准启动
pnpm openclaw gateway run --bind loopback --port 18789

# 强制启动（推荐用于重启）
pnpm openclaw gateway run --bind loopback --port 18789 --force

# 后台运行
nohup pnpm openclaw gateway run --bind loopback --port 18789 > /tmp/openclaw-gateway.log 2>&1 &
```

### 进程管理

```bash
# 停止 Gateway
pkill -9 -f "openclaw gateway"

# 检查运行状态
ps aux | grep "openclaw gateway"

# 检查端口占用
lsof -i :18789

# 清理端口
lsof -ti:18789 | xargs kill -9 2>/dev/null || true
```

### 日志查看

```bash
# 查看实时日志
tail -f /tmp/openclaw-gateway.log

# 查看最近日志
tail -n 50 /tmp/openclaw-gateway.log

# 查看错误日志
grep -i error /tmp/openclaw-gateway.log
```

---

## Web Channel 使用

### Web Channel 概述

Web Channel 是 OpenClaw 的核心功能之一，提供：

- **实时消息传输**：WebSocket 协议
- **多客户端支持**：支持 Control UI、第三方应用
- **安全连接**：基于 token 的认证
- **跨平台兼容**：浏览器和原生应用

### 启用 Web Channel

Web Channel 随 Gateway 自动启动，无需单独配置：

```bash
# 启动 Gateway 即自动启用 Web Channel
pnpm openclaw gateway run --bind loopback --port 18789
```

### 连接 Web Channel

#### 通过 Control UI

1. 访问 `http://127.0.0.1:18789`
2. 在设置中输入正确的 token
3. Control UI 会自动建立 WebSocket 连接

#### 通过编程方式

```javascript
const WebSocket = require("ws");
const ws = new WebSocket("ws://127.0.0.1:18789", {
  headers: {
    Authorization: "Bearer YOUR_TOKEN_HERE",
  },
});

ws.on("open", function open() {
  console.log("Connected to OpenClaw Web Channel");
});
```

### Web Channel 状态检查

```bash
# 检查 WebSocket 连接状态
pnpm openclaw channels status --probe
```

---

## Control UI 操作

### 访问 Control UI

```bash
# 自动打开带认证的 dashboard
pnpm openclaw dashboard
```

或直接访问：`http://127.0.0.1:18789`

### 初始设置

1. **Token 认证**：首次访问时输入 gateway token
2. **连接配置**：添加和管理各种聊天平台账户
3. **Channel 管理**：启用/禁用不同的消息通道
4. **插件配置**：安装和配置扩展功能

### 主要功能区域

- **Dashboard**：概览和状态监控
- **Connections**：管理各平台连接
- **Channels**：配置消息路由
- **Plugins**：扩展管理
- **Settings**：系统配置
- **Logs**：查看运行日志

### Token 设置

如果 Control UI 要求输入 token：

1. 从终端获取 token：`pnpm openclaw config get gateway.auth.token`
2. 或在浏览器 URL 中使用：`http://127.0.0.1:18789/#token=YOUR_TOKEN`
3. 在 Control UI 设置页面粘贴 token

---

## 常用命令参考

### Gateway 管理

```bash
# 启动 Gateway
pnpm openclaw gateway run --bind loopback --port 18789

# 强制重启 Gateway
pnpm openclaw gateway run --bind loopback --port 18789 --force

# 停止 Gateway
pkill -9 -f "openclaw gateway"
```

### Dashboard 和 UI

```bash
# 打开 Control UI
pnpm openclaw dashboard

# 获取配置信息
pnpm openclaw config get gateway.auth.token
```

### 开发相关

```bash
# 安装依赖
pnpm install

# 构建项目
pnpm build

# 开发模式运行
pnpm dev
```

### 系统维护

```bash
# 清理构建缓存
rm -rf dist/ node_modules/.cache/

# 重新构建
pnpm build

# 查看帮助
pnpm openclaw --help
pnpm openclaw gateway --help
```

---

## 故障排除

### 常见问题及解决方案

#### 1. 无法登录/认证失败

**症状**：Control UI 显示认证错误或被拒绝连接

**解决方案**：

```bash
# 检查 Gateway 是否运行
ps aux | grep "openclaw gateway"

# 检查端口占用
lsof -i :18789

# 如果是频率限制，等待 5-10 分钟
# 或重启 Gateway
pkill -9 -f "openclaw gateway"
pnpm openclaw gateway run --bind loopback --port 18789 --force

# 确保使用正确的 token
pnpm openclaw dashboard  # 自动生成正确 token
```

#### 2. Gateway 启动失败

**症状**：端口被占用或进程冲突

**解决方案**：

```bash
# 清理所有相关进程
pkill -9 -f "openclaw"
sleep 2 && lsof -ti:18789 | xargs kill -9 2>/dev/null || true

# 重新启动
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

#### 3. Web Channel 连接不稳定

**症状**：WebSocket 频繁断开或连接超时

**解决方案**：

```bash
# 检查网络连接
ping 127.0.0.1

# 查看 Gateway 日志
tail -n 30 /tmp/openclaw-gateway.log

# 重启 Gateway
pkill -9 -f "openclaw gateway"
pnpm openclaw gateway run --bind loopback --port 18789 --force
```

#### 4. Control UI 无法打开

**症状**：浏览器显示无法连接或空白页面

**解决方案**：

```bash
# 检查 Gateway 状态
ps aux | grep "openclaw gateway"
lsof -i :18789

# 手动打开 URL
open http://127.0.0.1:18789

# 或使用 CLI 打开
pnpm openclaw dashboard
```

### 日志分析

```bash
# 查看认证相关日志
grep -i "auth\|token\|unauthorized" /tmp/openclaw-gateway.log

# 查看连接状态日志
grep -i "ws\|websocket\|connection" /tmp/openclaw-gateway.log

# 查看错误日志
grep -i "error\|failed\|exception" /tmp/openclaw-gateway.log
```

### 重置和清理

如果遇到无法解决的问题：

```bash
# 完全清理并重启
pkill -9 -f "openclaw"
rm -f /tmp/openclaw-gateway.log
pnpm openclaw gateway run --bind loopback --port 18789 --force
pnpm openclaw dashboard
```

---

## 最佳实践

### 开发环境

1. **使用 loopback 绑定**：开发时始终使用 `--bind loopback` 确保安全
2. **固定端口**：使用相同端口（如 18789）避免混淆
3. **定期重启**：长时间开发后重启 Gateway 清理内存
4. **日志监控**：定期检查日志文件发现问题

### 生产环境建议

1. **使用反向代理**：配合 nginx 或类似工具
2. **HTTPS 加密**：生产环境必须使用 SSL/TLS
3. **防火墙配置**：只开放必要端口
4. **定期备份**：备份配置文件和数据库
5. **监控告警**：设置健康检查和服务监控

### 安全建议

1. **强 Token**：使用足够长度和复杂度的认证 token
2. **访问控制**：限制 Gateway 访问来源 IP
3. **定期轮换**：定期更换认证 token
4. **最小权限**：只启用必需的平台和插件

### 性能优化

1. **合理并发**：根据硬件调整并发连接数
2. **资源监控**：监控 CPU、内存使用情况
3. **日志轮转**：配置日志文件大小限制
4. **缓存策略**：合理使用缓存减少重复请求

---

## 获取帮助

### 官方资源

- **项目文档**：查看项目中的 `docs/` 目录
- **README 文件**：项目根目录的详细说明
- **Issue 跟踪**：报告问题和功能请求

### 社区支持

- **GitHub Discussions**：社区讨论和问题解答
- **Wiki 文档**：详细的功能说明和教程

### 紧急联系

如果遇到严重问题影响业务：

1. 首先检查本文档的故障排除章节
2. 查看项目 Issue 中是否有类似问题
3. 准备详细的错误日志和环境信息
4. 联系项目维护团队

---

## 版本信息

本文档基于 OpenClaw 2026.3.24 版本编写。不同版本间可能存在差异，请以实际安装的版本为准。

**最后更新**：2026年3月24日
**适用版本**：OpenClaw >= 2026.3.24
