## @Service
作用：配置成spring的bean，`@Service`注解点进来之后，其实就是一个@Conponent，就是把它标记成spring的一个bean。把它标记成spring的bean之后，就可以在Controller自动装配进来。

## @Controller
作用：允许接口的方法返回对象，并且对象会直接成Json文本，因为如果把当前接口返回给对应的客户端，肯定需要把后端的数据给他转换成Json文本，对应的客户端才能更好得进行处理。
<br>
<br>

## @RequestMapping
该注解需要给他加一级类级别的映射，即`@RequestMapping("/user")`,到时候客户端去访问我们当前的接口，即localhost:8080/user/** 来访问后面所有的接口。

## @Configuration
表示一个类为配置类