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

## HashMap
`HashMap`是Map集合框架中的一种键值对映射，用于存储和操作数据进行增删改查操作的，`HashMap`底层就是一个hash表，而hash表又是一个特殊的数组，特殊的点在于数组里面的下标不是由程序员写死的，而是由`hsahcode`经由取模运算求来的，而每个下标的桶里面村的数据实际上是Java的一个对象，而对象里面存的数据都是key和value对应的一个键值对，key其实就相当于你的身份证。它允许将键和值关联起来，以便通过键来查找和管理与之相关的值。`hashcode`的求法是由JVM底层的一些加密算法求来的，得到的hashcode实际上是int类型的数据，int类型占4个字节，每个字节包含了8位，则一个int类型的数据占32位，数据查找很快，但插入很慢。<br>
创建HashMap:使用无参构造函数创建一个空的HasmMap：<br>
`HasmMap<String,Integer> map = new HashMap<>();`
```Java
public class DaSheng{
    public static void main(String[] args){
        HashMap<String,String> hashMap = new HashMap<>();
        //增
        hashMap.put("ws","23");
        Syste.out.println(hashMap.get("ws",23));    //输出：18
        //改
        hashMap.put("ws","39");
        System.out.println(hashMap.get("ws","39")); //输出：39
        //删
        hashMap.remove("ws");
        System.out.println(hashMap.get("ws"));  //输出：null 
        //判断是否存在
        System.out.println(hashMap.containskey("ws"));  //输出：false
    }
}
```
获取`key-value`集合:
```Java
public class ws{
    public static void main(String[] args){
        HashMap<String,String> hashMap = new hashMap<>();
        hashMap.put("ws","18");
        hashMap.put("wws","23");
        hashMap.put("qzf","25");
        hashMap.put("ssw","49");
        Set<String> keys = hashMap.keySet();
        Collection<String> values = hashMap.values();
        for(String name:keys){
            System.out.println(name);
        }
        //输出：ws
        //wws
        //qzf
        //ssw
        for(String value:values){
            System.out.println(value);
        }
        //输出：18
        //23
        //25
        //49
    }
}
```
遍历hashMap:<br>
使用迭代器：`.entrySet()`:获取键值对结合；<br>
`.keySet()`:获取key集合；<br>
`.values()`:获取values集合；<br>
`.iterator()`:迭代器
```Java
public class fzq{
    public static void main(String[] args){
        HashMap<String,String> hashMap = new hashMap<>();
        hashMap.put("ws","23");
        hashMap.put("fzq","25");
        hashMap.put("qzf","26");
        hashMap.put("ggl","18");
        Set<String> keys = hashMap.keySet();
        Collection<String> values = hashMap.values();

        Iterator<Map.Entry<String,String>> iterator = hashMap.entrySet().iterator();
        while(iterator.hasNext()){
            System.out.println(iterator.next().getValue());
        }
        //或
        for(Map.Entry<String,String> entry:hashMap.entrySet()){
            System.out.println(entry.getKey()+":"+entry.getValue());
        }
    }
    //输出：ws:23
    //fzq:25
    //qzf:26
    //ggl:18
}
```
<br>
<br>

## 泛型
泛型尤其是在面向对象编程和设计模式挺重要的<br>
背景：Java推出泛型之前，程序员可以构建一个元素类型为Object的集合，该集合能够存储任意的数据类型对象，而在使用该集合的过程中，需要程序员明确知道存储每个元素的数据类型，否则很容易引发`ClassCastException`异常(类型转换异常)。Java推出泛型与集合有很大的关系，之前使用集合的时候都使用的是泛型集合。<br>
先创建一个非泛型的`ArrayList`：
```Java
import java.util.ArrayList;

public class WsClass{
    public static void main(String[] args){
        ArrayList list = new ArrayList();
        //如果没有使用注释，这个集合存储元素的时候它将会按Object的类型来处理；---add(Object e)
        list.add("java");   //字符串
        list.add(100);
        list.add(true); //boolean类型
        //这种没有使用泛型的集合添加元素很方便
        //list.for(快速生成)
        for(int i = 0;i<list.size();i++){
            Object o = list.get(i);
            String str = (String)o;
            System.out.println(str);
        }
    }
}
```
上面代码中的for循环会报异常：`Exception in thread "main" java.lang.ClassCastException:class java.lang.Integer cannot be cast to class java.lang.String`<br>
反省是JDK5中引入的一个新特性，泛型提供了编译时类型安全监测机制，该机制允许在编译时检测到非法的类型数据结构，**泛型的本质就是参数化类型**，也就是所操作的数据类型被定位一个参数<br>
当使用泛型后：
```Java
public class sswClass{
    public static void main(String[] args){
        ArrayList list = new ArrayList();
        list.add("java");
        list.add("100");
        list.add(true);
        for(int i = 0;i<list.size();i++){
            Object 0 = list.get();
            String str = (String)o;
            System.out.println(str);
        }
        ArrayList<String> strList = new ArrayList<>();
        strList.add("a");   //添加int类型或boolean类型会编辑报错
        strList.add("b");
        strList.add("c");
        for(int i = 0;i<strList.size();i++){
            String s = strList.get(i);  //不需要进行类型转换
            System.out.println(s);  //可以正常运行
        }
    }
}
```
泛型集合：第一可提供编译器的类型检测机制，只要指定了集合存储的数据类型，在向集合添加元素的时候，在编译器就会对元素类型进行检查；<br>
第二在获取集合里面元素的时候，不需要类型转换，直接拿指定的数据类型去接收里面的元素。
```Java
ArrayList<Integer> intList = new ArrayList<>();
intList.add(100);
intList.add(200);
intList.add(300);
for(int i = 0;i<intList.size();i++){
    Integer integer = intList.get(i);
    //或者  int num = intList.get(i);
    System.out.println(num);
}
```
foreach循环：<br>
以下是一个for循环：
```Java
public class ForEachDemo{
    public static void main(String[] args){
        String s = {"a","bb","ccc","dddd"};
        int totalLength = 0;
        for(int i = 0;i<s.length;i++){
            totalLength = totalLength + s.[i].length();
        }
    }
}
```
循环变量：是循环控制的利器，但有不足的地方：<br>
下面是一个二维数组：
```Java
public class ForEachDemo{
    public static void main(String[] args){
        int[][] n = {{1,2},{3,4,5},{6,7,8,9}};
        for(int i = 0;i<n[i].length;i++){
            for(int j = 0;j<n[i].length;i++){
                System.out.println(n[i][j]);
            }
        }
    }
} 
```
一般的for循环长这样：
```Java
public class ForEachDemo{
    public static void main(String[] args){
        String[] s = {"a","b,c,d","e,f,g,h"};
        int totalLength = 0;
        for(int i = 0;i<s.length();i++){
            totalLength = totalLength + s[i].length();
        }
        int[][] n = {{1,2},{3,4,5},{6,7,8,9,10}};
        for(int i = 0;i<n.length;i++){
            for(int j = 0;j<n[i].length;j++){
                System.out.println(n[i][j]);
            }
        }
    }
}
```
for-each循环，用来简化for循环语法，代码就变成了：
```Java
public class ForEachDemo{
    public static void main(String[] args){
        String[] s = {"a","bb","ccc","dddd"};
        int totolLength = 0;
        //for(变量的类型就是数组元素的类型 变量str代表数组元素的值：数组）{
        //...
        //}
        for(String str:s){
            totalLength = totalLength + str.length();
        }
        //每次循环，Java从数组中取一个值，赋值给变量，取值从第0个元素开始，到最后一个元素为止

    }
}
```
for-each循环不支持修改<br>
例如for循环修改元素的值：
```Java
int[][] n = {{1,2},{3,4,5},{6,7,8,9}};
for(int[] innerArray:n){
    for(int number:innerArray){
        number = number*10;
    }
    for(int[] innerArray:n){
        for(int number:innerArray){
            System.out.println(number);
        }
    }
    //输出依旧是123456789
}
```
之所以修改不成功，是因为for-each循环与数组的联系是单向的，以`int[][] n = {{1,2},{3,4,5},{6,7,8,9}}`中的4为例，当for-each循环要获取4的值时，首先会生成4的一份拷贝，然后把这份拷贝赋值给变量number，当执行`number = number*10;`只要把这份拷贝从4改成了40，原件中的4保持不变，所以for-each循环是对元素的拷贝值进行操作，而不是对元素本身的值进行操作，这是for-each循环和普通下标循环最大的区别。<br>
`Integer`和`int`的区别：
```Java
public class IntegerText{
    @Test
    public void integerText{
        Integer a = 130;
        Integer b = 130;
        System.out.println(a==b);   //输出：false
        int a1 = 130;
        int a2 = 130;
        System.out.println(a1==b1); //输出：true
    }
}
```
造成这种结果是因为integer是int的一种装箱类型，或者integer可以简单理解为一种对象，它在比较内存地址，这里声明两个integer，实际上是两个不同的对象，虽然值是相同的，但他们的内存地址不一样。<br>
要看懂一个`.class`，可以安装`Jclasslib`插件，写的Java代码都需要编成`.class`文件，再给虚拟机去执行。`Jclasslib`插件可以让我们清晰的看到Java代码编译成class文件长什么样，`Jclasslib`作了一些翻译，（show Bytecode With Jclass）在翻译中，在`si push`之后，会调用一个静态方法，`Integer.valueOf`，这个方法是放在常量池中的，需要调用常量池中的第2号变量，变量代表的是`.valueOf`方法：
`sipush 130`<br>
`invokestatic #2 <java/lang/Integer.valueOf:0`<br>
这个方法中如果满足一个if条件，那么返回的是队列当中的某一个值，如果不满足，返回`new Integer(i)`:
```Java
public static Integer valueOf(int i){
    if(i>=IntegerCache.low&&i<=IntegerCache.high)
        return IntegerCache.cache[i+(-IntegerCache.low)];
    return new Integer(i);
}
```
<br>
<br>

## Git使用
1、在gittee上创建一个仓库；<br>
2、拷贝公司项目代码：去到想要拷贝的文件夹，右键点击`Git Bash Here`,执行：`git clone 项目的SSh地址`，（Shift+Insert粘贴）
2、接着来到IDEA初始化一下git，首先在IDEA的终端执行命令创建：`touch README.md`；<br>
3、继续在IDEA终端执行命令创建：`touch .gitignore`，它的作用是把配置的一些配置文件，匹配上的进行一个忽略，不会推送到git仓库上，也不会检查到本地的一些变化，忽略什么就在里面陪什么；<br>
4、接着在IDEA终端执行命令：`git init`,提示：`Initialized Git repository in /Users/softa/softa/.git/`；<br>
5、然后执行：`git status`,就可以发现哪些文件发生了变化；<br>
6、然后执行：`git add .`:添加所有的变更文件；<br>
7、然后执行：`git commit -am 'first commit init project'`(加-am就是后面加注释的意思)，这些文件就被提交完了，但是只是提交到本地仓库里，如果想要连接到远程仓库里，需要在IDEA终端执行命令：`git remote add origin SSH地址`；<br>
8、然后查看一下分支：`git branch`，输出结果：`* master`<br>
9、然后就可以把本地的推送到远程的master上,执行：`git push -u origin master`。这个时候会报一个错，说提交失败，没有提交到远程，提示说你可能是想第一次整合远程的一个变化，提示在执行push的时候，首先执行以下`git pull`,就是说把现在分支上的拉取过来，这个时候从远程开始更新，开始拿过来，然后再执行：`git push -u origin master`,出现了如下报错：`Updates were rejected because the tip of your current branch is behind`,也就是刚刚创建的分支没有远程的分支新，可执行强制推送：`git push -u -f origin master`,因为再码云中刚刚创建的项目中什么都没有，直接把master进行一个覆盖就可以，成功之后刷新一下git的master,至此项目git的初始化就完成了，执行：`git branch`,结果：`*master`;执行`git branch -r`可以查看远程的分支，但一般是采用分支开发，主干发布的方式，那么创建1.0的分支，执行：`git checkout -b v1.0 origin/master`，提示`Switched to a branch'v1.0'`,已经切换到一个新的分支，检查一下当前的分支：`git branch`,结果：<br>
`master`<br>
`* v1.0`<br>
可以看到本地的分支是v1.0,这个时候需要把这个分支推送到远程，执行：`git push origin HEAD -u`,就会看到远程的git上就会有这个分支了，v1.0的代码是在master的基础上创建的<br>
进入IDEA打开项目之后右上角有3个箭头，左边第一个蓝色的箭头，表更新，拉去，即`git pull`,就是把远程代码拉取到我们这个项目里；中间一个绿色的打勾，就是提交，推送到远程代码，比如说把代码下载之后我们写一个代码，在创建文件的时候他会问你想不想把这个文件添加到git中，也就是ADD，暂存区中。新建的文件如果你没有添加到暂存区的话，既没有`git add .`，文件名是显示红色的，如果我们想要把这个文件添加到暂存区中，如果想要回滚，也可以右键点击文件选择Git，选择Rollback，他又不在暂存区了，当写完代码，想要提交的时候选择中间那个绿色的打勾，IDEA左上角就会出现：<br>
`Changes`<br>
`> 空白方块 Unversioned Files 1 file`<br>
有些文件忘记添加到暂存区，这里没有直接显示，把“>”展开，如下：<br>
`Changes`<br>
`向下箭头 空白方块 Unversioned Files 1 file`<br>
 `空白方块 GitTest.java`<br>
 在下面的输入框里输入git测试2（提交信息），因为用命令输入的话是`git commit -m/(-am) "提交信息"`,提交完之后就由红色变成正常的颜色，如果没有添加到本地工作区中，而只是添加到这个暂存区的话，他是绿色，即新建一个文件的时候，在弹出对话框是否添加到暂存区的时候选是，文件就会显示绿色，因为没有提交，当写代码commit之后，又写了一些代码，写的比较多，如果想回到上个版本，右键点击文件选择Git，选择Rollback，它又回到你没修改之前的样子了，如果我们想要看每行代码是谁写的，鼠标右键点击指定行代码左边的空白处，选择`Annotate with Git Blame`,会显示`Today Zy* >`<br>
 如果只想下载某个分支的代码，执行:`git clone -b master(分支名称) "URL地址"`,如果你下的不是指定分支的代码，可以在IDEA右下角有个`P master`:
 `空格 Cheakout Tag or Revision ..`<br>
 `Local Branches`<br>
 `空格 master`<br>
 `空格 feature-new`<br>
 `Remote Branches`<br>
 `五角星 origin/master`<br>
 `空格 origin/feature-new   //点击选择Checkout`<br>
 当你下载主分支代码之后，可能需要创建一个新的分支去写，就可以右键点击master,即上面代码中的`空格 master`，选择`New Branch from 'master'...`建完新的分支dev之后，写完代码之后commit,提交完推送，点击IDEA右下角的dev，右键点击push,就可以推送到这个远端，但是一般先拉取再推送，先把远程的代码更新一下再进行推送，拉取的过程中可能会发生冲突，比如说你和你的同事都同时修改了一个文件，就会发成冲突。<br>
 当需要把代码往master合并，我们不能自己去合，不能自己通过命令，而是需要特定的人，特定的权限，只有这个有合并权限的人，才可以往主分支去合并，这种一般都是在Gitlab的管理页面去发送的合并请求，比如说分支dev需要往master进行合并，我们就要先切到master，去拉取，即把本地的master给更新一下，因为可能其他人也往master进行更新，而之前拉出来的代码已经不是最新的代码了，就需要把master代码给更新一下，再切换到这个开发分支，然后在终端执行：`git merge master`,结果：`Already up to date`,合过来之后再推送出去，然后在gitlab的管理页面去发送合并请求，然后有这个合并权限的人才能够正确的去给你合并，如果想要回滚，在IDEA左下角调集Git,选择想要回滚到哪个状态的版本，右键点击`Reset Current Branch to Here...`，选中hard就行，然后reset，如果想要再回来，方法一样。
<br>
<br>

## MyBatis三剑客
1、第一剑客：`mybatis-generation`就是根据我们的数据库自动生成pojo，和dao和对应的xml文件，pojo里面放的是跟db的字段一一对应的一个对象，dao是一个接口，供service调用，xml是dao层接口的一个实现，即sql语句会都写在xml里面，首先要保证db是可以连接的，通过一个客户端软件Navicat,然后用`mybatis-generator`来生成这些文件，要安装`mybatis-generator`,首先在pom.xml里：
```XML
<build>
    <finalName>softa</finalName>
    <plugins>
        <plugin>
            <groupId>org.mybatis.generator</groupId>
            <artifactId>mybatis-generator-maven-plugin</artifactId>
            <version>1.3.2</version>
            <configuration>
                <verbose>true</verbose>
                <overwrite>true</overwrite>
            </configuration>
        </plugin>  <!--这样一来这个配置需要的jar包就加载进来了-->
    </plugins>
</build>
```
然后就是配置`mybatis-generator`<be>
2、第二剑客：`mybatis-generator`
