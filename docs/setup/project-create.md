# 项目搭建及配置
1、springboot的两个配置文件：application.yml pom.xml(负责导入maven的依赖)。在创建完项目之后，去数据库设计表结构，之后进行全局配置文件（application.yml）的编写。<br>
2、**application.yml的配置编写**：因为是要用java操作数据库，所以要配置数据源：
```Java
Spring:
    datasource:
        type: com.alibaba.druid.pool.DruidDataSource
        driver-class-name: com.mysql.cj.jdbc.Driver //驱动
        url: jdbc:mysql://localhost:3306/Student?useSSL=false&characterEncoding=utf8
        username: root
        password: aaaaa
    //当在Controller跳转到index上，会变成/index.jsp,就会跳转到这上面
    mvc: 
        view:
            prefix: /
            suffix: .jsp
    //因为做完查询之后，要将结果显示到jsp中，所以需要配置jsp的映射路径：即上面mvc的配置
    mybatis:
        type-aliases-package: com.example.student.pojo
        //放置映射文件的路径，通常在resources里面建一个包mapper
        mapper-locations: classpath:/mapper/*Mapper.xml
```
**可能出现的问题**：当在application.yml中配置数据源的时候，写完`type: com.alibaba.druid.pool.DruidDataSource`报红，是因为没有添加Druid连接池依赖。解决方法：在pom.xml中添加Druid依赖


