## git commit规范
Git每次提交代码，都要写Commit message(提交说明)，否则就不允许提交。一般来说，commit message应该清晰明了，说明本次提交的目的。<br>
这里写一下Angular规范，前端框架Angular.js采用的就是该规范。<br>
commitl类别：<br>
1、feat: 新功能（feature）
2、fix: 修补bug
3、docs： 文档（documentation）
4、style: 格式（不影响代码运行的变动）
5、refactor: 重构（即不是新增功能，也不是修改bug的代码变动
6、test: 增加测试
7、chore: 构建过程或辅助工具的变动

## Rest
举例在UserController中用不同的映射注解来去表示增删改查，可以使用springmvc提供的rest风格的接口<br>
Rest:就是根据客户端不同的请求方法，发起的任意一个请求，是有一个请求头的，请求头里面就有当前服务端的请求方法（`右击检查-network-is-white-list.json-Headers-Request Method`）<br>
**`@GetMapping`:表查询**<br>
**`@PostMapping`：表新增**<br>
**`@PutMapping`:表修改**<br>
**`@DeleteMapping`:表删除**<br>