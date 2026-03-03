# 一、基础语法
## 1、数据类型
在Java中，**数据类型分为数字类型和非数字类型。**<br>
**数字类型又分为整数类型和小数类型**<br>
**整数类型分为byte、short、int、long四种类型**<br>
1、byte: 占用1个字节（8位），取值范围为-128到127；<br>
2、short: 占用2个字节（16位），取值范围为-32768到32767；<br>
3、int: 占用4个字节（32位），取值范围为-21亿到21亿；<br>
4、long: 占用8个字节（64位），可以表达更大的整数。<br>
**小数类型分为float、double两种类型**<br>
1、float: 单精度浮点数，占用4个字节，表示精度有限的小数；<br>
2、double: 双精度浮点数，占用8个字节，表示更高精度的小数。<br>
一个8位的二进制数据，如果按整数解释，就是byte类型。<br>
**非数字类型主要包括字符串String、字符char、布尔类型boolean**<br>
1、char: 占用2个字节（16位），支持`Unicode`编码。它既可以表示英文字母，也可以表示汉字或符号。<br>
字节用'B'表示，位用'b'表示<br>
最小的存储单位是bit(比特位)，但计算机实际上以byte（字节）为最小的可寻址存储单元。<br>
1、1B = 8bit<br>
2、1KB = 1024B<br>
3、1MB = 1024KB<br>
4、1GB = 1024MB<br>
5、1TB = 1024GB<br>
**Java中还有一种分类，是根据存储方式来进行分类的，分为基本数据类型和引用数据类型**<br>
1、基本数据类型：即存储这个值的时候，会直接存到我们的内存里面。内存的某个某个位置上存的是具体的某个值。只要能到这个空间，就一定能找到这个值。包含byte、short、int、long、float、double、char、boolean八种数据类型。<br>
2、引用数据类型：就不是把这个值存到内存空间里面去，把值存到另一个空间，把这个空间的地址存到类型的变量中去。包含：<br>
(1).字符串String:一种特殊的类，用于表示文本信息；<br>
(2).类Class：比如自定义的Student、Person类对象；<br>
(3).接口Interface：定义了行为规范；<br>
(4).数组Array:一组相同类型的数据集合，如：int[],String[];<br>
(5).枚举Enum：表示一组固定常量的类型。
<br>
<br>

## 2、流程控制
1、switch：<br>
```Java
public class Demo{
    public static void main(String[] args){
        int a = 1;
        switch(a){
            case 1:
                System.out.println("王松");
                break;
            case 2:
                System.out.println("毛泽东");
                break;
            case 3:
                System.out.println("唐嫣");
                break;
            default:
                System.out.pringln("周恩来")；
                break;
        }
    }
}
```
2、while:<br>
```Java
public class Demo{
    public static void main(String[] args){
        int a = 0;
        while(a<10){
            System.out.println(a);
            a++;
        }
    }
}
//a=10退出循环
```
3、do-while：<br>
```Java
public class Demo{
    public static void main(String[] args){
        int a = 0;
        do{
            System.out.println(a);
            a++;
        }while(a<10);
    }
}
```
例：
```Java
public class Demo{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String pwd1 = "0";
        String pwd2 = "-1";
        do{
            System.out.println("请输入密码：");
            pwd1 = sc.nextLine();
            System.out.println("请再次输入密码：");
            pwd2 = sc.nextLine();
            if(!pwd1.equals(pwd2)){
                System.out.println("您输入的密码不一致，请重新输入！");
            }
        }while(!pwd1.equals(pwd2));
        System.out.println("设置密码成功!");
    }
}
```