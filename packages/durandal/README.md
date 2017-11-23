# Durandal
## 全程NodeJS微服务框架

Durandal is the renowned sword of Roland, the legendary paladin of Charlemagne in the body of literature Matter of France.

The name is most likely from the French dur, meaning "hard" and "long lasting", as in "to endure".

## 使用说明

### 环境及依赖

安装[NodeJS(>v7.x)](https://nodejs.org/dist/)
4
安装cnpm并将源指向内部私有仓库

```bash
npm install cnpm -g
cnpm config set registry http://npm.dev.quancheng-ec.com
```

### 安装

#### 单独安装

```bash
cnpm install @quancheng/Durandal --save
```

#### 使用cli生成项目

```bash
npm install durandal-cli -g

durandal init project-name
```

具体请移步[Durandal-CLI](https://github.com/quancheng-ec/Durandal-CLI)