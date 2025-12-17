## 连接数据库错误
当控制台出现如下报错：`Failed to configure a dataSource:'url' attribute is not specified`是因为连接数据库的远程地址没有指定<br>
解决方法是去到resources目录下的application.xml配置（或者application.properties）<br>
**创建数据库的表可以用代码的方式动态的创建，这就是spring data jpa**,它可以面向对象来操作数据库 