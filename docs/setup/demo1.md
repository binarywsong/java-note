## 1、UserController如何编写
```Java
@RestController //接口方法返回对象，转换成Json文本
@RequestMapping("/user")    //localhost:8080/user/**
public class UserController{
    //增加
    @PostMapping    //前端请求的地址：localhost:8080/user,后面需要这个地址去做测试
    public String add(User user){

    }
}
```
上面`add()`括号里面需要接受客户端传出过来的user信息，`public String add(User user)`，这样写可以把User的类用于参数的接收。但对于规范有要求的一个项目，会有一种更好的方法，**DTO类**即数据传输类，来去接收这些客户端请求过来的参数。因为客户端请求过来的参数不一定是com.example.user.pojo包下的User类所包含的那几个参数。解决方式是在com.example.user.pojo目录下再创建一个包dto，在其中创建一个**类UserDto(将新增的一些字段放在里边)**：
```Java
public class UserDto{
    private String userName;
    private Strinf password;
    private String email;
    //get、set方法...
    //toString方法...
}
```
`@RequestBody`:传进来的UserDto是一个Json文本，会自动帮我们转成对象
UserController代码如下：
```Java
@RestController //接收方法返回对象，并转换成json文本
@RequestMapping("/user")    //localhost:8080/user/** 
public class UserController{
    @PostMapping    //URL=localhost:8080/user method:post
    public String add(@RequestBody UserDto userdto){
        //...
        return "success";
    }
} 
```
随后调用业务逻辑类，在com.example.user.service包下的UserService，通常一个业务逻辑类会创建一个接口，面向接口进行编程，对于以后的扩展性和维护性会更强，在学玩设计模式之后会对此有更清晰的了解。<br>
## @Service
作用：配置成spring的bean，`@Service`注解点进来之后，其实就是一个@Conponent，就是把它标记成spring的一个bean。把它标记成spring的bean之后，就可以在Controller自动装配进来。<br>
在com.example.user.controller包下的UserController中：
```Java
@RestController //接口方法返回对象，转换成json文本
@RequestMapping("/user")
public class UserController{
    @Autowired
    IUserService userService;   //用userService进行接收
    @PostMapping    //URL:localhost:8080/user method:post
    public String add(@RequestBody UserDto userdto){
        userService.add(user);
        return "success";
    }
}
```
因为userService要调用add(user);方法，所以：<br>
在com.example.user.servive包中的接口IUserService:
```Java
public interface IUserService{
    /**
     * 插入用户
     * @param user
     */
    void add(UserDto userDto);
}
```
对于接口IUserService要有它自己的实现类：<br>
即在com.example.user.service包下的类UserService:
```Java
@Service    //配置spring的bean
public class UserServiceImpl implements IUserService{
    @Oveerride
    public void add(UserDto userDto){
        //调用数据访问类
        //...
    }
}
```
故在com.example.user.repository包下的接口UserRepository:如果使用的是spring data jpa,我们就会创建一个接口，因为对应的增删改查的方法不需要我们自己去实现，我们只需要去继承CrudRepository这个接口，他会自动帮我们实现好，如果要继承CrudRepository这个接口，可以去指定两个类型，第一个类型是我们要操作哪个pojo类，当前的UserRepositpry肯定操作的是user pojo类，第二个类型是这个user类他的主键id是什么数据类型，即`extends UrudRepository<User,Integer>`<br>
@Repository注解同样是把当前的类注册为spring的bean，之所以不同的类要加上不同的注解：@Service、@Repository,以及@Component,三个都是配置成spring的bean，使用@Component来表示把当前类注册为spring的bean也可以，只不过用@Service来表示业务逻辑类的bean，用@Repository来表示数据访问层的bean，它的职责更加的明确，故在com.example.user.repository包下的UserRepository中：
```Java
public interface UserRepository extends CrudRepository<User,Integer>{
    //...
}
```
既然数据访问层的接口UserRepository创建好了，因为service层依赖于数据访问层，依赖即注入，因此：<br>
在com.example.user.service包下的UserService实现类中：
```Java
@Service    //把该类注册为spring的bean
public class UserSevice implements IUserService{
    @Autowired
    UserRepository userRepository;
    @Override
    public void add(UserDto user){
        //调用userRepository的save()方法，增加和修改尽可以调，save()方法会自动帮我们判别传进去的User类如果有id就修改，没有id就自动新增
        userRepository.save(user);  //这里是不能传入UserDto的，只能传user类型，原因如下：
    }
}
```
在com.example.user.repoditory包下的UserRepository中：
```Java
@Repository //把该类注册为spring的bean
public interface UserRepository extends CrudRepository<User,Integer>{
    //...
}
```
我们设置的CrudRepository接口的第一类型是User类<br>
在弄清楚save()方法只能传入user类型之后，Spring提供了一个BeanUtils，然后把里卖弄的属性拷贝一份，即BeanUtils.copyProperties();,第一个参数代表要拷贝哪一个对象，第二个参数代表你要拷贝到哪一个对象里去。<br>
于是在com.example.user.service包下的UserServiceImpl类中：
```Java
@Service    //把该类注册为spring的bean
public class UserServiceImpl implements IUserService{
    @Autowired
    UserRepository userRepository;
    @Override
    public void add(UserDto userDto){
        User userPojo = new User();
        BeanUtils.copyProperties(user,userPojo);
        return userRepository.save(userPojo);
    }
}
```
如果用Postman测试接口，当响应的数据是一个字符串，也有可能响应的数据是一个json，当前端调用`https://localhost:8088/user`,不能返回给前端乱七八糟的数据，因为前端会不知道怎么处理，所以对前端来说，它需要一个通用的响应数据的格式，故我们需要封装一个通用的返回数据类型：<br>
在com.example.user.pojo包下创建一个ReponseMessage：200代表成功；500代表内部服务器错误；404戴白哦没有请求的资源，还可以响应一个文本message，即请求成功，请求失败以文本的方式响应出去，还需要加一个相应的数据，因为如果是查询接口的话，肯定需要把查询的User给它返回回去，因为响应的类型是作为一个通用的类型，它不仅仅是用户Controller会用到，以后其他各种各样的Controller都会用这个统一的Controller来进行响应，，所以不能写：private User user;而是需要指定一个泛型，需要在类上声明一个泛型：`public class ResponseMessage<T>`,然后就可以给他传递任何的数据类型。private T data;它可以接收User对象，也可以接收后面新建的任何对象：
```Java
public class RepositoryMessage<T>{
    private Integer code;
    private String message;
    private T data;
    
    //get、set方法...（一定要有）
}
```
因为最后会把ReponseMessage作为返回类型，而Spring在看到返回的类型是一个对象的时候，它会把这个对象自动转换成json，他就把你属性的的值取出来，就会自动的调用get方法，如果没有get方法就会有问题<br>
在com.example.user.controller包下的UserControler：
```Java
@RestControler  //接收方法返回对象。并转换成json文本
@RequestMapping("/user")    //localhost:8080/user/**
public class UserController{
    //增加
    @PostMapping    //localhost:8080/user
    public ReposseMessage add(@RequestBody UserDto user){
        User userAdd = userService.add(user);
        return Response.success(userAdd);
    }
}
```
这里如果要返回ResponseMessage，需要自己去new：new ResponseMessage();如果每个接口都需要去new这个ResponseMessage,有些麻烦，我们可以封装一个公共的返回类型ResponseMessage:<br>
在com.example.user.pojo包下的ResponseMessage:
```Java
public class ResponseMessage<T>{
    private Integer code;
    private String message;
    private T data;
    public static ResponseMessage success(){
        //...
    }
}
```
加强版的ResponseMessage:
```Java
public class ResponseMessage<T>{
    private Integer code;
    private String message;
    private T data;
    public static <T> ResponseMessage<T> success(T data){
        ResponseMessage responseMessage = new ResponseMessage();
        responseMessage.setCode(HttpStatus.OK.value()); //200
        responseMessage.setMessage="success";
        responseMessage.serData(data);
        return responseMessage;
    }
    //get、set方法
}
```
测试解耦返回结果模板：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": 2,
        "userName": "wangsong",
        "password": "123456",
        "email": "123@qq.com"
    }
}
```
这里还可以对参数的验证做一个改造，如果前端没有传用户名，我们可以提示用户名不能为空，我们可以引入对应的参数验证的第三方的库，可以在pom.xml加入参数校验的依赖：
```XML
<dependency>
    <groupId>org.springframework.boot</groupId>
    <srtifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
之后就可以在需要验证的地方加上对应的注解，举例：<br>
@NotNull:不能为null值
@NotEmpty:不能为双引号
@NotBlank():可以唔叼空格，需要指定一个属性：message="..."
@Length():指定密码的长度，比如必须是6~12位，例：@Length(min=6,max=12)
在com.example.user.pojo.dto包下的UserDto类：
```Java
public class UserDto{
    @NotBlank(message="用户名不能为空")
    private String userName;
    @NotBlank(message="密码不能为空")
    @Length(min=6,max=12)
    private String password;
    @Email(message="email格式不正确")
    private String email;
    //get、set方法
}
```
还有需要改进的地方，当出现异常的时候，使用postman模拟发送，它返回的数据类型并不是所要求的统一数据类型：
```json
    {
    "timestamp": "2024-07-29T13:19:26.875+00:00",
    "status": 400,
    "error": "Bad Request",
    "path": "/user"
    }
```
我们的统一数据类型是有code，有message:
```Java
public class ResponseMessage<T>{
    private Integer code;
    private String message;
    private T data;
}
```
那前端如果拿到不是所要求的数据类型，然后去做响应处理，肯定会有问题，所有我们可以加入一个统一的异常处理，<br>
在com.example.user.exception包下创建一个类：GlobalExceptionHandleAdvice(统一的异常处理器通知)<br>
`@ExceptionHandler`:此注解代表要进行什么异常的统一处理，因为异常是有不同类型的，`@ExceptionHandle`({Exception ,class})就是为所有的Exception,就是所以异常的父类，也就是无论出现了什么异常，它的父类都是Exception,那么我们就为所有的异常都作统一的异常处理。
```Java
@RestControllerAdvice   //专门用来做统一处理
public class GlobalExceptionHandleAdvice{
    @ExceptionHandler
    public ResponseMessage handleException(){
        //...
    }
}
```
这个方法的参数可用来接收当前的异常，以及http的ServletRequest,和HttpServletResponse(Request和Response不一定会用到，但是要求的方法格式就是这样，然后再里面进行统一的异常处理)：
```Java
@RestControllerAdvice   //统一处理
public class GlobalExceptionHandlerAdvice{
    @ExceptionHandler({Exception.class})
    public ResponseMessage handlerException(Exception e,HttpServletRequest request,HttpServletResponse response){
        return new ResponseMessage(500, ...);
    }
}
```
code设置成500代表后端异常，即无论是后端任何的异常我们都返回500到前端，具体什么异常可以查日志。
```Java
@RestControllerAdvice   //统一处理
public class GlobalExceptionHandlerAdvice{
    @ExceptionHandler({Logger log=LoggerFactory.getLogger(GlobalExceptionHandlerAdvice.class)})
    public ResponseMessage handlerException(Exception e,HttpServletRequest request,HttpServletResponse response){
        //记录日志
        log.error("统一异常：",e);
        //异常没有数据类型，可以传null
        return new ResponseMessage(code:500, message:"error",data:null);
    }
}
```
接下来继续改造UserController:
```Java
@RestController //接收方法返回对象，并转换成json文本
@RequestMapping("/user")
public class UserController{
    @Autowired
    IUserService userService;

    @PostMapping    //localhost:8080/user
    public ResponseMessage add(@Validated @RequestBody UserDto user){
        User userNew = userService.add(user);
        return ResponseMessage.success(userAdd);
    }
    
    //查询（通常查哪一个id的数据，可以映射一个路径）
    @GetMapping("/{userId}")    //URL:localhost:8080/user/1
    public ResponseMessage add(@PathVariable Integer userId){
        User userNew = userService.getUser(userId);
        return ReponseMessage.success(userNew);
    }
}
```
因为业务方法是没有的，故创建，在com.example.user.service下的IUserService的接口：
```Java
public interface IUserService{
    /**
     * 插入用户
     * @Param user 参数
     * return
     */
    User add(UserDto user);
    /**
     * 查询用户
     * @Param userId 用户id
     * @return
     */
    User getUser(Integer userId);
}
```
接下来写接口的实现，在com.example.user.service包下的UserService类：
```Java
@Service    //将此类注册为spring的dean
public class UserService implements IUserService{
    @Autowired
    UserRepository userRepository;

    @Override
    public User add(UserDto user){
        User userDto = new User();
        BeanUtils.copyProperties(user, userPojo);
        return userRepository.save(userPojo);
    }

    //按住`Alt + Enter`快速的生成重写方法
    @Override
    public User getUser(Integer userId){
        userRepository.findById(userId);    //返回的是Optional
        Optional<User> byId = userRepository.findById(userId);
    }
}
```
Optional是专门用来处理空指针的，因为有可能根据userId就查不出来，那查不出来可以去调用`orElseThrow();`也就是说没有的话，就抛出一个异常，在里面可以结合`Lambda`表达式：
```Java
.orElseThorw(()->{
    //...
})
```
Lambda:允许将函数作为参数传递<br>
```Java
@Override
public User getUser(Integer userId){
    return userRepository.findById(userId).orElseThrow( ()->{
        //throw new 一个参数的异常；这个异常里直接抛出"用户..."
        throw new IllegalArgumentException("用户不存在，参数异常")
    });
}
```
因为如果用户ID没有查到用户，一般都是前端恶意用户的请求，因为按照正常来请求的话，一般是不会查到不存在的用户<br>
我们在postman输入URL：localhost:8080/user/1,返回结果为：
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "userId": 1,
        "userName": "wsong",
        "password": "123456",
        "email": "123@qq.com"
    }
}
```
修改也是在com.example.user.controller包下的UserController类中:
```Java
@RestController //接收方法返回对象，并转换成json文本
@RequestMapping //localhost:8080/user/**
public class UserController{
    @Autowired
    IUserService userService;

    //REST
    //增加
    @PostMapping    //localhost:8080/user
    public ResponseMessage add(@Validated @RequestBody UserDto user){
        User userNew = userService.add(user);
        return ResponseMessage.success(userAdd);
    }

    //查询（通常查哪一个id的数据，可以映射成一个路径
    @GetMapping("/{userId}")    //URL:localhost:8080/user/1
    public ResponseMessage get(@PathVariable Integer userId){
        User userNew = userService.getUser(userId);
        return ResponseMessage.success(userNew);
    }

    //修改
    @PostMapping
    public RepositoryMessage edit(@Validated @RequestBody UserDto user){
        User userNew = userService.edit(user);
        return ResponseMessage.success(userNew);
    }
}
```
然后生成edit这个方法:<br>
在com.example.user.service包下的IUserService中：
```Java
public interface IUserService{
    /**
     * 插入用户
     * param user 参数
     * @return 
     */
    User add(UserDto user);

    /**
     * 查询用户
     * @param userId 用户id
     * @return 
     */
    User getUser(Integer userId);

    /**
     * 修改用户
     * param user 修改用户对象
     * @return
     */
    User edit(UserDto user);
} 
```
然后去到实现类，生成对应的这个方法：
在com.example.user.service包下的UserService类中：
```Java
@Service    //将此类注册为spring的bean
public class UserService implements IUserService{
    @Autowired
    UserRepository userRepository;

    @Override
    public User add(UserDto user){
        User userPojo = new User();
        BeanUtils.copyProperties(user,userPojo);
        return userRepository.save(userPojo);   
    }

    @Override
    public User getUser(Integer userId){
        return userRepository.findById(userId).orElseThrow(()->{
            throw new IllegalArgumentException("用户不存在，参数异常");
        });
    }


    @Override
    public User edit(UserDto user){
        return userResponse.save();
    }
    //需要将dto对象转成pojo对象，因为save()方法只允许接收pojo类型的对象
    //上面的edit方法换为：
    @Override
    public User edit(UserDto user){
        User userPojo = new User();
        BeanUtils.copyProperties(user,userPojo);
        return userRepository.save(userPojo);
    }
}
```
导入`HashMap`类：`import java.util.HashMap;`<br>
导入`ArrayList`类：`import java.util.ArrayList`<br>



