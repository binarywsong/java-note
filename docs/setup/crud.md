# 全查功能的实现
步骤：1、封装实体类；<br>
2、书写dao接口；<br>
3、mapper映射文件；<br>
4、service接口；<br>
5、service接口实现；<br>
6、controller;<br>
7、jsp编写；<br>
8、测试。

## 全查功能的实现
**1**、封装实体类：所有的实体都要放在pojo（com.example.student）包里面
```Java
public class Student{
    private Integer id;
    private String name;
    private Integer age;
    private String gender;

    //无参构造...Alt+Insert
    //全参构造...
    //生成get、set方法...
}
```
**2**、写dao接口（StudentDao）
```Java
@Mapper
public interface StudentDao{
    //全查学生信息,返回值是list集合，泛型是Student
    public List<Student> selectAll();
}
```
**可能出现的问题**：如果写完`@Mapper`报红，是因为缺少Mybatis核心依赖。解决方法：在pom.xml中添加如下依赖：
```Java
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    //<version>3.0.3</version>
    <version>2.1</version>
</dependency>
```
**3**、mapper映射文件：在resources下创建一个包mapper，文件名为studentMapper.xml:
```XML
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace = "com.example.student.dao.StudentDao">
    <select id = "selectAll" resultType = "student">
        SELECT * FROM student
    </select>
</mapper>
```
**可能出现的问题**：如果在写mapper映射文件时，写`select id="selectAll" resultType="child"或者"Child"`时"child"或者"Child"报红名，这是Mybatis类型解析的常见问题。<br>
问题原因分析：resultType解析规则：Mybatis在解析resultType会依次尝试：<br>
（1）、直接使用简单类名,如"child";<br>
（2）、在type-aliases-package指定包下查找；<br>
（3）、使用完全限定类名。 <br>
解决方法：使用完全限定类名-即修改childMapper.xml中的resultType为完整包路径：
```XML
<select id="selectAll" resultType="com.example.child.pojo.Child">
    SELECT * FROM child
</select>
```
**4**、service接口（StudentService）
```Java
@service
@Transactional
public interface StudentService{
    //全查学生信息
    public List<Student> queryAll();
}
```
**5**、service实现类：Alt+回车可以快速创建一个接口的实现类
```Java
@Service    //将StudentServices的实现类创造出来，纳入工厂
@Transactional  //事务控制注解
public class StudentServiceImpl implements StudentService{
    //对于StudentService,它依赖于Dao-依赖即注入
    //我们需要注入，从工厂里卖弄获取StudentDao
    @Autowired
    private StudentDao sd;
    @Override
    publci List<Student> queryAll(){
        return sd.selectAll();
    }
}
```
**6**、Controller控制器(StudentController)
```Java
@Controller //指定控制器
@RequestMapping("student")
public class StudentController{
    //Controller依赖于Service-依赖即注入
    @Autowired
    private StudentService ss;
    //全查
    @RequestMapping("queryAll")
    public String queryAll(Model model){
        //调用StudentService的实现类，获取到List集合
        List<Student> list = ss.queryAll();
        //List集合需要存到作用域，即存到model中
        //没有model需要我们在方法中声明一个model
        model.addAttribute("list", list); 
        //控制跳转，这样就会根据在application里的配置，跳转到/showAll.jsp
        return "showAll";
    }
}
```
**7**、jsp编写<br>
在resources下创建一个文件夹webapp,其中创建showAll.jsp:
```JSP
<%@ page contentType="text/html:charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
    <head>
        <title>Tittle</title>
    </head>    
    <body>
        <center>
            <h3>学生信息展示页面</h3>
            <table border = "," width = "600px">
                <tr>
                    <td>学生编号</td>
                    <td>学生姓名</td>
                    <td>学生性别</td>
                    <td>学生年龄</td>
                </tr>
                //使用c-for-each来遍历
                <c:foreach items=${list} var="a">
                    <tr>
                        <td>${a.id}</td>
                        <td>${a.name}</td>
                        <td>${a.gender}</td>
                        <td>${a.age}</td>
                    </tr>
                </c:foreach>
            </table>
        </center>
    </body>
</html>
```
**可能遇到的问题**：当在`showAll.jsp`中写`<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`报红名，原因是未添加jstl的依赖，以及taglib的依赖。解决方法：在pom.xml中添加如下代码：
```XML
<dependency>
    <groupId>javax.servlet.jsp.jstl</groupId>
    <artifactId>jstl-api</artifactId>
    <version>1.2</version>
</dependency>
<dependency>
    <groupId>taglibs</groupId>
    <artifactId>standard</artifactId>
    <version>1.1.2</version>
</dependency>
```
<br>
<br>

## 根据id删除
思路如下：1、jsp页面点击删除按钮之后，将id删除信息传给Controller层；<br>
2、Controller层调用Service层完成根据id进行删除；<br>
3、Service层接受ID信息，调用Dao层实现类完成删除；<br>
4、Dao层根据ID删除学生信息；<br>
5、Dao层删除之后给Service层反馈，Service层判断是否成功：一是看从Dao层传过来的返回值，二是看异常的处理；<br>
6、Service层接到从Dao层传过来的反馈，传向Controller层；
7、Controller层根据Service反馈，**如果成功删除就跳转全查，如果删除失败就跳转错误页面**
<br>

**1**、写dao接口
在com.example.child.dao中的ChildDao中：
```Java
@Mapper
public interface ChildDao{
    //全查学生信息
    public List<Child> selectAll();
    //根绝ID删除学生信息
    public void deleteById(Integer id);
}
```
**2**、Mapper映射文件
在resources.mapper包下的childMapper.xml:
```XML
<mapper namespace="com.example.child.dao.ChildDao">
    <select id="selectAll" resultType="child">
        SELECT * FROM child
    </select>
    <!--根据ID删除学生信息-->
    <delete id="deleteById" parameterType="Integer">
        DELETE FROM child WHERE id=#{id}
    </delete>
</mapper>
```
**3**、Service接口（IChildService）
```Java
public interface IChildService{
    //全查学生信息
    public List<Child> queryAll();
    //根据ID删除学生信息
    public void removeById(Integer id);
}
```
**4**、Service接口实现类
在com.example.child.service包下的ChildServiceImpl中：
```Java
@Service
@Transactional
public class ChildServiceImpl implements ChildService{
    @Autowired
    private ChildDao cd;
    @Override
    public List<child> queryAll(){
        return cd.selectAll();
    }
    @Override
    public void removeById(Integer id){
        try{
            cd.deleteById(id);
        }catch(Exception e){
            throw new RuntimeException("根据ID删除有异常");
        }
    }
}
```
**5**、Controller类
在com.example.child.controller包中的ChildController中：
```Java
@Controller
@RequestMapping("/child/")
public class ChildController{
    @Autowired
    private ChildService cs;
    @RequestMapping("queryAll")
    public String queryAll(Model model){
        List<Child> list=cs.queryAll();
        model.addAttribute("list", list);
        return "showAll";
    }
    //根据ID删除学生信息
    @RequestMapping("removeById")
    public void removeById(Integer id){
        try{
            cs.removeById(id);
        }catch(Exception e){
            return "error";
        }
    }
}
```
**6**、jsp
在resources.webapp包下的showAll.jsp:
```JSP
<%@page contentType="text/html:charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
    <head>Tittle</head>
    <body>
        <center>
            <h3>学生信息展示页面</h3>
            <table border="," width="600px">
                <tr>
                    <td>学生编号</td>
                    <td>学生姓名</td>
                    <td>学生性别</td>
                    <td>学生年龄</td>
                    <td>学生操作</td>
                </tr>
                <c:foreach items="${list}" var="a">
                    <tr>
                        <td>${a.id}</td>
                        <td>${a.name}</td>
                        <td>${a.gender}</td>
                        <td>${a.age}</td>
                        <td>
                            <a href="${pageContent.request.contextPath}/child/removeById?id=${a.id}">删除-</a>
                        </td>
                    </tr>
                </c:foreach>
            </table>
        </center>
    </body>
</html>
```
<br>
<br>

## 添加学生信息
**1**、Dao层
在com.example.child.dao包下的ChildDao:
```Java
@Mapper
public interface ChildDao{
    //全查学生信息
    public List<Child> selectAll();
    //根据ID删除学生信息
    public void deleteById(Integer id);
    //添加学生信息
    public void insertChild(Child child);
}
```
**2**、mapper映射文件
在resources.mapper包下的childMapper.xml:
```XML
<mapper namespace="com.example.child.dao.ChildDao">
    <select id="selectAll" resultType="child">
        SELECT * FROM child
    </select>
    <!--根据id删除学生信息-->
    <delete id="deleteById" parameterType="Integer">
        DELETE FROM child WHERE id=#{id}
    </delete>
    <!--添加学生信息-->
    <insert id="insertChild" parameterType="child">
        INSERT INTO child(name,age,gender) values(#{name},#{age},#{gender})
    </insert>
</mapper>
```
**3**、Service接口
在com.example.child.service包下的IChildService接口：
```Java
public interface IChildService{
    //全查学生信息
    public List<Child> queryAll();
    //根据ID删除学生信息
    public void removeById(Integer id);
    //添加学生信息
    public void addChild(Child child);
}
```
**4**、Service接口实现类
在com.example.child.service包下的ChildServiceImpl:
```Java
@Service
@Transactional
public class ChildServiceImpl implements ChildService{
    @Autowired
    private ChildDao cd;
    @Override
    public List<Child> queryAll(){
        return cd.selectAll();
    }
    @Override
    public void removeById(Integer id){
        try{
            cd.deleteById(id);
        }catch(Exception e){
            throw new RuntimeException("根据ID删除有异常");
        }
    }
    @Override
    public void addChild(Child child){
        try{
            cd.insertChild(child);
        } catch(Exception e){
            throw new RuntimeException("添加有异常");
        }
    }
}
```
**5**、Controler
在com.example.child.controller包下的ChildController中：
```Java
@Controller
@RequestMapping("/child")
public class ChildController{
    @Autowired
    private ChildService cs;
    @RequestMapping("queryAll")
    public String queryAll(Model model){
        List<Child> list=cs.queryAll();
        model.addAttribute("list", list);
        return "showAll";
    }
    //根据ID删除学生信息
    @RequestMapping("removeById")
    public void removeById(Integer id){
        try{
            cs.removeById(id);
            return "redirect:/child/queryAll";
        }catch(Exception e){
            return "error";
        }
    }
    //添加学生信息
    @RequestMapping("addChild")
    public void addChild(Child child){
        try{
            cs.addChild(child);
            return "redirect:/child/queryAll";
        }catch(Exception e){
            e.printStackTrace();
            return "error";
        }
    }
}
```
**6**、jsp
在webapp包下的add.jsp:
```JSP
<%@page contentType="text/html:charset=UTF-8" language="java" %>
<html>
    <head>
        <tittle>Tittle</tittle>
    </head>
    <body>
        <center>
            <h3>学生信息添加页面</h3>
            <form action="${pageContent.request.contextPath}/child/addChild">
                学生姓名：<input type="text" name="name"><br>
                学生年龄：<input type="text" name="age"><br>
                学生性别：<input type="radio" name="gender" value="男" checked="checked">男
                        <input type="radio" name="gender" value="女">女<br>
                <input type="submit" value="提交">
            </form>
        </center>
    </body>
</html>
```
需要在showAll.jsp添加一个超链接：
```jsp
<%@page contentType="text/html:charset=UTF-8" language="java" %>
<%@taglib prefix="c" uri="http://java.sum.com/jsp/jstl/core" %>
<html>
    <head>
        <tittle>Tittle</tittle>
    </head>
    <body>
        <center>
            <h3>学生信息展示页面</h3>
            <table border="," width="600px">
                <tr>
                    <td>学生编号</td>
                    <td>学生姓名</td>
                    <td>学生性别</td>
                    <td>学生年龄</td>
                    <td>学生操作</td>
                </tr>
                <c:foreach items="${list}" var="a">
                    <tr>
                        <td>${a.id}</td>
                        <td>${a.name}</td>
                        <td>${a.gender}</td>
                        <td>$a.age</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/child/removeById?id=${a.id}">删除</a>
                        </td>
                    </tr>
                </c:foreach>
            </table>
            <a href="/add.jsp">添加学生信息</a>
        </center>
    </body>
</html>
```
## 修改学生信息-数据回显
**1**、Dao接口
在com.example.child.dao包下的ChildDao接口中：
```Java
@Mapper
public interface ChildDao{
    //全查学生信息
    public List<Child> selectAll();
    //根据ID删除学生信息
    public void deleteById(Integer id);
    //添加学生信息
    public void insertChild(Child child);
    //根据id查询学生信息
    public Child selectById(Integer id);
}
```
**2**、写数据回显的mapper映射文件
在resources/mapper包下的childMapper.xml中：
```XML
<mapper namespace="com.example.child.dao.ChildDao">
    <select id="selectAll" resultType="child">
        SELECT * FROM child
    </select>
    <!--根据ID删除学生信息-->
    <delete id="deleteById" parameterType="Integer">
        DELETE FROM child WHERE id=#{id}
    </delete>
    <!--添加学生信息-->
    <insert id="insertChild" parameterType="child">
        INSERT INTO child(name,age,gender) values(#{name},#{age},#{gender}) 
    </insert>
    <!--根据ID查询学生信息-->
    <select id="selectById" parameterType="Integer" resultType="child">
        SELECT * FROM child WHERE id=#{id}
    </select>
</mapper>
```
**3**、数据回显之Service接口
在com.example.child.service包下的IChildService接口：
```Java
public interface ChildService{
    //全查学生信息
    public List<Child> selectAll();
    //根据ID删除学生信息
    public void deleteById(Integer id);
    //添加学生信息
    public void addChild(Child child);
    //根据ID查询学生信息
    public Child selectById(Integer id);
}
```
**4**、数据回显之Service接口实现
在com.example.child.service.impl包下的ChildServiceImpl中：
```Java
@Service
@Transactional
public class ChildServiceImpl implements ChildService{
    @Autowired
    private ChildService cs;
    @Override
    public List<Child> queryAll(){
        retrun cs.selectAll();
    }
}
```
