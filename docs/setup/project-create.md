## 项目搭建及配置
1、springboot的两个配置文件：application.yml pom.xml(负责导入maven的依赖)。在创建完项目之后，去数据库设计表结构，之后进行全局配置文件（application.yml）的编写。<br />
2、首先需要有一个用户需要的pojo类，即pojo包下创建的User类，需要这个User类映射为数据库的一个表，因为spring data jpa是面向对象的方式来去操作数据库，所以可以添加`@Table`、`@Entity`两个注解。这两个注解都是将一个类映射成一个表：
```Java
@Table
//@Entity
public class User{
    private Integer userId;
    private String username;
    private String password;
    private String email;
    //get、set方法...
    //toString生成...
}
```
**当使用了`@Table`、`@Entity`这两个注解之后，默认就会把类名当做表名**，所以可以重新映射一个表名：
```Java
@Table(name="tb_user")
//@Entity(name="tb_user")
public class User{
    ...
}
```
这样写它会报错，提示你添加主键id，我们可以将userId当作主键，添加`@Id`注解。<br />
这个id你希望是以什么样的方式进行生成，**如果希望id是自动生成的方式，就加上`@GeneratedValue`注解，在注解里面指定生成的策略，给他指定为自增的方式**：
```Java
@GeneratedValue(strategy=Generation.IdENTITY)
```
**还可以用`@Column`改变字段名，因为默认情况下它会把属性名作为数据库表的字段名**：<br />
`@Column(name="user_id")` //用蛇形命名不用驼峰式
完整模板为：
```Java
@Table(name="tb_user")
@Entity
public class User{
    @Id
    @GeneratedValue(strategy=GenerationType.IdENTITY)
    @Column(name="user_id")
    private Integer userId;

    @Column(name="user_name")
    private String userName;

    @Column(name="password")
    private String password;

    @Column(name="email")
    private String email;

    //get、set方法...

    @Override
    public String toString(){
        return "User{" +
            "userId=" + userId + 
            ", username=" + username + '\' +
            ", password=" + password + '\' +
            ", email=" + email + '\' +
            "}";
    }
}
```

<br />
<br />

## application.yml
因为是要用java操作数据库，所以要配置数据源：
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
<br />
<br />

## application.properties
在maven项目中，application.properties文件是Spring Boot应用程序的配置文件之一，其中属性spring.application.name是springboot中的一个标准属性，它用于指定应用程序的名称，因此设置spring.application.name属性有助于在分布式环境中识别和管理应用程序
```XML
spring.application.name=springboot_wangsong
#web应用端口，默认8080
server.port=8080
<!--显示sql-->
spring.jpa.show-sql=true

spring.datasource.url=jdbc:mysql://localhost:3306/child?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=aaaaa<!--这三句是关于spring data jpa-->
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
<!--格式化sql语句，避免一行打印在控制台上-->
spring.jpa.properties.hibernate.format_sql=true
<!--自动更新数据库表结构-->
spring.jpa.hibernate.ddl-auto=update
```
<br />
如果我希望一启动项目它就自动为我生成数据库的表，怎么让它根据配置生成数据库的表呢，就需要在application.properties中加入这一项配置：<br />
`spring.jpa.hibernate.ddl-auto=update`
<br />
它会自动更新数据库表的结构，也就是说如果数据库没有这个表，它会插入；如果我添加了一个字段，他也会帮我在数据库里添加一个字段。
<br />
<br />

**还有一个配置是格式化sql**，因为到时候生成的一些sql语句，希望让他打印在控制台，如果不格式化，他会全部一行显示，对我们开发进行调试就不太友好：<br />
`spring.jpa.properties.hibernate.format_sql=true`
<br />
<br />

application.properties中还有一个配置，可以显示sql，当执行sql操作，以及生成表，他都会为控制台显示ui对应的sql语句<br />
<br />
<br />

## pom.xml
是SprinBoot的依赖配置文件，一个标准的pom.xml会有一个标准的`<parent>`，这个`<parent>`就是继承springboot的一个父maven项目
```XML
<parent>
    <groupId>org.springframework.boot</groupId>
    <!--管理所有依赖的版本，可以解决依赖跟依赖之间的版本冲突问题-->
    <artifactId>spring-boot-starter-parent<artifactId>
    <version>3.3.2</version>
    <!--这个其实可以去掉，它其实在file-Project Stucture配置的jdk进行使用，不需要单独的去进行配置-->
    <properties>
        <java.version>17</java.version>
    </properties>
    <!--下面是创建项目时选择的依赖：-->
    <dependencies>
        <!--spring data jpa 操作数据库-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!--整合springmvc需要的一个starter-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--mysql驱动-->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!--单元测试-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>



```
