## 无法识别.vue文件
当出现如下报错：`Could not find a declaration file for module './App.vue'. `,是因为无法识别`.vue`文件。<br>
解决方法：**添加`shims-vue.d.ts`**来解决`.vue`模型的类型声明。<br>
具体步骤：
- 1、在项目src目录下创建一个名为`shims-vue.d.ts`的文件
- 2、`shims-vue.d.ts`代码如下：
```typescript
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
- 3、在项目根目录下的`tsconfig.app.json`文件中加上：
```typescript
{
  "include": [
    "src/**/*.ts", 
    "src/**/*.d.ts", 
    "src/**/*.vue"]
}
```
<br>

## `TypeScript`不认识SVG依赖库`virtual:svg-icons-register`
这是因为`TypeScript`的世界里没有对应的类型声明，所以会报错。<br>
思路：让`TypeScript`知道这个虚拟模块的存在
解决方法：
- 1、在项目src目录下新建一个文件`shims-vue.d.ts`中：
```typescript
// src/vite-env.d.ts
declare module 'virtual:svg-icons-register' {
  const content: any;
  export default content;
}
```
- 2、确保`tsconfig.json`的include配置中包含这个声明文件：
```TypeScript
  "src/**/*.d.ts"
```