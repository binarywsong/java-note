在如下代码中：
```Java
@Data
public class HisException extends RuntimeException{
    private String msg;
    private int code = 500;
    public HisException(Exception e){
        super(e);
        this.msg="执行异常";
    }
}
```
`super(e)`的作用：调用父类构造方法，`super(e)`显式调用父类（Exception类）的带参构造方法，将原始异常对象e传递给父类处理<br>
`this.msg`表示当前类的实例字段msg，在此处赋值为固定字符串“执行异常”，**this用于区分成员变量与局部变量**（当存在同名变量是时）<br>
**成员变量与局部变量是面向对象编程中的两种作用域不同的变量类型**：<br>
成员变量：<1>定义在类内部，方法外部的变量，属于对象的属性；<br>
<2>与对象共存亡（实例变量）或与类共存亡（静态变量）<br>
<3>在整个类内均可访问，若为public还可通过对象实例外部访问<br>
<4>有默认初始价值（如int默认为0，对象默认为null）<br>
例：
```Java
class Car{
    String color;   //成员变量（实例变量）
    static int wheels = 4;  //成员变量（静态变量）
}
```
局部变量：<1>定义在方法、构造器或代码内部的变量，仅限局部使用<br>
<2>方法/代码块执行时创建，执行结束后销毁<br>
<3>仅在声明它的方法或代码块内有效<br>
<4>无默认值，必须显式初始化后才能使用。
例：
```Java
void calculate{
    int resullt = 0;    //局部变量
    System.out.println(result);
}
```
成员变量描述对象的特征，局部变量处理方法内的临时逻辑，合理使用两者能提升代码的封装性和效率。<br>
`this.list=list;`中`this.list`只想当前类的实例变量，而右侧的list是构造函数的参数，通过this明确指定要赋值的是成员变量而非局部变量。<br>
`ArrayList`是一个集合，在一些方面强过数组的数组：
```Java
public class ArrayList{
    public static void main(String[] args){
        ArrayList<String> list = new ArrayList<>();
        //添加
        list.add("张三");
        list.add("李四");
        list.add("王五");
        System.out.println(list);   //输出：【张三、李四、王五】
        //在指定位置添加
        list.add(1,"小明");
        System.out.println(list);   //输出：【张三、小明、李四、王五】
        //删除(使用remove（）方法会将删除的东西给你返回来)
        System.out.println(list.remove(1)); //输出：小明
        System.out.println(list.remove("小明"))；
        //测试集合的长度
        System.out.println(list.size());    //输出：3
        //重写即修改，同样使用set（）方法会将改掉的词返回给你
        System.out.println(list.set(0,"张三程序员"));   //输出：张三   
    }
}
```