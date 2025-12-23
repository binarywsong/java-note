## 连接数据库错误
当控制台出现如下报错：`Failed to configure a dataSource:'url' attribute is not specified`是因为连接数据库的远程地址没有指定<br>
解决方法是去到resources目录下的application.xml配置（或者application.properties）
<br>
<br>

**创建数据库的表可以用代码的方式动态的创建，这就是spring data jpa**,它可以面向对象来操作数据库 

## @Data报红
是因为未安装Lombok插件或未添加Lombok依赖<br>
在`pom.xml`中添加：
```XML
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```
<br>

**怎么能让Web方法调用sa Token框架来验证Token？**：在Web方法上面加上`@SaCheckLogin`注解

## 在IDEA终端执行命令：`touch README.md`报错？
这是因为windows系统不支持Linux命令touch，导致PowerShell无法识别该命令，需先执行安装touch-cli工具：`npm install -g touch-cli`,成功执行之后依旧执行不了`touch README.md`，是因为当前策略禁止运行脚本（`Restricted`）,需将其调整为`Unrestricted`或`RemoteSigned`，具体操作如下：<br>
1、以管理员身份打开`PowerShell`：在开始菜单搜索`PowerShell`,选择”以管理员身份运行“;<br>
2、查当前策略：`Get-ExecutionPolicy`,若显示Restricted,则需修改；<br>
3、设置执行策略：`Set-ExecutionPolicy Unrestricted`;<br>
4、如果需要恢复，则执行：`Set-ExecutionPolicy Restricted`<br>
文件：`D\Deliver` 反斜杠<br>
网址：`https://coding/lesson` 斜杠 