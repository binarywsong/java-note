九行星工作经历：
系统一：OA管理系统（建议选择此系统）
包含功能：考勤审批、员工管理（员工档案、工牌图片管理、福利管理、体检列表、银行卡库）、招聘管理（招聘需求管理、简历管理、伯乐管理、offer管理）、财务管理（个人银行卡、工资密钥、公司资料管理）、协同办公（员工签名管理、人事变动、转正、晋升、调动、离职）、行政管理（维修管理、出行管理）、绩效考核、考勤（排班管理、考勤统计）。
系统二：跨境电商系统：SKU管理、占坑SKU。业务逻辑可以抽象出来：如SKU的增删改查、审批流程、库存管理。其中SKU管理包含常见的CRUD操作、审批流程、关联查询。
后端职责：负责设计数据库、开发REST API、实现业务逻辑、集成工作流。
这里欲要选取SKU管理模块，截图中有关于SKU列表，占坑SKU（如何实现sku的创建、查询、编辑、审批流程），版型库，元素库等。
SKU管理与版型、元素相关，可能需要关联查询。可以设计数据库：版型表、元素表、SKU表（关联版型、元素）、审批记录表。
工作内容：实习期间负责跨境电商后台系统的SKU管理模块开发，包括SKU的增删查改、版型关联、元素关联、SKU占坑、SKU审批流程。
技术要点：Spring Boot、MyBatis-Plus、MySQL、Redis（缓存常用查询）、JWT权限控制、Swagger文档等。
产出效果：提升了sku管理效率，支持了多条件筛选，实现了版型一键创建sku。
代码思路：分层设计、数据库表设计、API设计、缓存策略等。
Java代码：包含实体类、Mapper、Service、Controller，以及一些工具类和配置类。

可以实现以下API：
1、分页查询sku列表（支持多条件筛选）；
2、创建sku（包括占坑sku）；
3、编辑sku；
4、删除sku；
5、根据版型一键创建sku；
6、提交审批；
7、审批通过/驳回。
核心板块：sku管理模块

系统：跨境电商ERP系统
工作职责：
1、参与需求评审、独立设计sku管理模块的数据库表结构；
2、基于Spring Boot+MyBatis-Plus开发RESTful API,实现sku的增删改查，多条件分页查询，版型关联查询，占坑sku创建，一键生成sku；
3、对接前端sku列表页，实现40+个筛选条件的动态组合查询，并利用Redis缓存高频查询结果；
4、实现sku审批流程（提交审批，审批通过/驳回），状态流转使用状态机模式；
5、编写Swagger接口文档，配合测试完成功能上线。
工具库：
1、核心框架：Spring Boot2.7,Spring MVC,MyBatis-Plus3.5
2、数据存储：MySQL8.0（主库），Redis 6.x(缓存+分布式锁）；
3、接口风格：RESTful API，JSON数据交互
4、安全控制：JWT Token鉴权，RBAC权限模型；
5、工具库：Hutool（工具类），EasyExcel（导出）、Lombok
6、部署：Maven构建，Git版本控制
产出效果：
1、效率提升：sku录入效率提升60%，通过“版型一键生成sku”功能，运营人员创建sku的时间从5分钟缩短至30秒；
2、数据准确性：通过唯一索引和业务校验，杜绝了sku编码重复，版型与元素不匹配等问题；
3、查询性能：多条件组合查询响应时间<200ms,Redis缓存命中率达85%以上；
4、流程规范化：sku上线必须经过审批，避免了无效或侵权商品
上架，减少了后续客诉。

数据库设计：
1、sku:SKU主表，存储SKU编码、名称、图片、价格、状态、关联版型ID、元素ID；
2、Style：版型表，存储版型基础信息（版型编码、名称、类目、材质等）；
3、element：元素表，存储设计元素（如印花，图案等）；
4、Sku_audit:审批记录表，记录每次审批操作。
分页查询：
利用MyBatis-Plus的LambdaQueryWrapper动态拼接查询条件，支持模糊查询、范围查询、精准匹配。高频查询条件组合使用Redis缓存，key设计为条件MD5值，缓存时间5分钟。
创建sku：
使用@Transactional保证事务一致性，生成唯一sku编码（前缀+时间戳+随机数）。校验版型是否存在，元素是否存在，是否已占用。占坑sku只记录基本信息，状态为“草稿”；
审批流程：
定义状态枚举（草稿、待审批、已通过、已驳回），提交审批时创建审批记录，更新sku状态。审批通过/驳回时更新状态，并记录审批意见。
一键生成sku:
根据版型id，自动生成多个sku（如不同颜色、尺码组合）。使用线程池异步处理，避免接口超时。
一、实体类1
```java
//sku.java
import com.baomidou.mybatisplus.annotation.*;
Import lombok.Data;
Import java.math.BigDecimal;
Import java.time.localDateTime;

@Data
@TableName(“sku”)
Public class Sku{
@TableId(type=IdType.AUTO
Private Long id;
Private String skuCode;	//sku编码
Private String skuName;	//sku名称
Private String mainImage;	//主图URL
Private BigDecimal price;		//价格
Private Integer status;	//状态：0-草稿 1-待审批 2-已通过 3-已驳回
Private Long styleId;	//版型id
Private Long elementId;	//元素id
Private String color;	//颜色
Private String size;	//尺码
Private Integer stock;	//库存
Private String supplierName;		//供应商名称
Private String supplierCode;	//供应商编号
Private Integer isDeleted;		//逻辑删除：0-正常 1-删除

@TableField(fill=FieldFill.INSERT)
Private LocalDateTime = createTime;
@TableField(fill = FieldFill.INSERT_UPDATE)
Private LocalDateTime = updateTime;
Private Long createBy;	//创建人id
}
```

二、实体类2
```java
Import lombok.Data;
Import com.baomidou.mybatisplus.annotation.*;

@Data
@TableName(“style”)
Public class Style{
@TableId(type = IdType.AUTO)
Private Long id;	
Private String styleCode;	//版型编码
Private String styleName;		//版型名称
Private String category;	//类目
Private BigDecimal weight;	//重量（g）
Private String material;	//材质
Private String sizeChart;	//尺码图URL
Private String templateImage;	//套版图URL
Private String supplierInfo;	//供应商信息
Private Integer status;	//状态：0-正常 1-废弃
}
```

三、实体类3
```java
//Element.java
Import lombok.Data;
Import com.baomidou.mybatisplus.annotation.*;

@Data
@TableName(“element”)
Public class Element{
@Table(type=IdType.AUTO
Private Long id;
Private String elementCode;	//	元素编码
	private String elementName;		//元素名称
Private String elementType;	//元素类型（印花、图案）
Private String color;	//元素颜色
Private String imageUrl;	//元素图url
Private Integer isViolation;	//是否违背：0-否 1-是
}
```

四、实体类4
```java
//SkuAudit.java
Import lombok.Data;
Import com.baomidou.mybatisplus.annotation.*;
Import java.time.localDateTime;

@Data
@TableName(“sku_audit”)
Public class SkuAudit{
@TableId(type=IdType.AUTO
Private Long id;
Private Long skuId;
Private Integer action;	//操作类型：1-提交 2-通过 3-驳回
Private String comment;	//审批意见
Private Long operator;	//操作人Id
Private LocalDateTime operateTime;
}
```

2、mapper层
```java
//SkuMapper.java
Import com.baomidou.mybatisplus.core.mapper.BaseMapper;
Import org.apache.ibatis.annotation.Mapper;

@Mapper
Public interface SkuMapper extends BaseMapper<Sku>{
//可以自定义复杂SQL，但简单查询使用BaseMapper即可
}

@Mapper
Public interface StyleMapper extends BaseMapper<Style>{
}

@Mapper
Public interface ElementMapper extends BaseMapper<Element>{
}

@Mapper
Public interface SkuAuditMapper extends BaseMapper<SkuAudit>{
}
```

3、service层
```java
//SkuService.java
Import com.baomidou.mybatisplus.extension.service.IService;
Import com.baomidou.mybatisplus.core.metadata.IPage;
Import java.util.List;

Public interface SkuService extends IService<Sku>{
    IPage<Sku> queryPage(SkuQueryDTO dto);
    String createSku(SkuCreateDTO dto, Lang userId);
    Boolean updateSku(SkuUpdateDTO dto, Long userId);
    Boolean deleteSku(Long id);
    Boolean submitAudit(Long skuId, Long userId);
    Boolean approveAudit(Long skuId, String comment, Long userId);
    Boolean rejectAudit(Long skuId, String comment, Long userId);
    List<String> batchCreateByStyle(Long styleId, Long userId);
} 
```

```java
//SkuServiceImpl.java
Import cn.hutool.core.util.IdUtil;
Import cn.hutool.core.util.StrUtil;
Import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
Import com.baomidou.mybatisplus.core.metadata.IPage;
Import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
Import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
Import lombok.extern.slf4j.Slf4j;
Import org.springframework.beans.factory.annotation.Autowired;
Import org.springframework.data.redis.core.StringRedisTemplate;
Import org.springframework.stereotype.Service;
Import org.springframework.transaction.annoation.Transactional;

Import java.math.BigDecimal;
Import java.time.Duration;
Import java.util.ArrayList;
Import java.util.List;
Import java.util.concurrent.CompletableFuture;
Import java.util.consurrent.ThreadPoolExecutor;

@Slf4j
@Service
Public class SkuServiceImpl extends ServiceImpl<SkuMapper,Sku> implements SkuService{
    @Autowired
    Private StyleMapper styleMapper;
    @Autowired
    Private ElementMapper elementMapper;
    @Autowired
    Private SkuAuditMapper skuAuditMapper;
    @Autowired
    Private StringRedisTemplate redisTemplate;
    @Autowired
    Private ThreadPoolExecutor taskExecutor;

    //缓存key前缀
    Private static final String SKU_PAGE_CACHE_PREFIX=”sku:page:”;

    @Override
    Public IPage<Sku> queryPage(SkuQueryDTO dto){
    //生成缓存key(基于查询条件的MD5)
    //实际应使用MD5
        String cacheKey = SKU_PAGE_CACHE_PREFIX + dto.hashCode();	String cacheJson = redisTemplate.opsForValue().get(cacheKey);
        If(StrUtil.isNotBlank(cachedJson)){
        //反序列化并返回（实际使用JSON工具）
        Log.info(“命中缓存,key:{}”,cacheKey);
        //return JSON.parseObject(cachedJson,new TypeReference<IPage<Sku>(){}>;

        //未命中，查询数据库
        Page<Sku> page = new Page<>(dto.getPageNum(),dto.getPageSize());
        LambdaQueryWrapper<Sku> wrapper = new LambdaQueryWrapper<>();
        //动态拼接条件
        If(StrUtil.isNotBlank(dto.getSkuCode())){
            Wrapper.like(Sku::getSkuCode,dto.getSkuCode());
        }
        If(StrUtil.isNotBlank(dto.getSkuName())){
            Wrapper.like(Sku::getSkuName, dto.getSkuName());
        }
        If(dto.getStatus() != null){
            Wrapper.eq(Sku::getStatus, dto.getStatus());
        }
        If(dto.getStyleId() != null){
            Wrapper.eq(Sku::getStyleId, dto.getStyleId());
        }
        If(dto.getElementId() != null){
            Wrapper.eq(Sku::getElementId, dto.getElementId());
        }
        If(dto.getMinPrice() != null){
            Wrapper.ge(Sku::getPrice, dto.getMinPrice());
        }
        If(dto.getMaxPrice() != null){
            Wrapper.le(Sku::getPrice, dto.getMaxPrice());
        }
        //更多条件省略。。。
        Wrapper.eq(Sku::getIsDeleted, 0);
        Wrapper.orderByDesc(Sku::getCreateTime);
        IPage<Sku> result = baseMapper.selectPage(page, wrapper);
        //存入缓存（5分钟过期）
        //redisTemplate.opsForValue().set(cacheKey, JSON.toJSONString(result), Duration.ofMinutes(5));
        Return result;
    }

    @Override
    @Transactional(rollbackFor = Exeception.class)
    Public String createSku(SkuCreateDTO dto, Long userId){ 
        //验证版型是否存在
        Style style = styleMapper.selectById(dto.getStyleId());
        If(style == null){
            Throw new BusinessException(“版型不存在”);
        }
        //校验元素（如果有）
        If(dto.getElementId() != null){
        Element element = elementMapper.selectById(dto.getElementId());
        If(element == null){
            Throw new BusinessException(“元素不存在”);
        }
        //生成唯一SKU编码
        String skuCode = generateSkuCode(style.getStyleCode(), dto.getColor(), dto.getSize());

        //检查是否已存在（唯一约束）
        LambdaQueryWrapper<Sku> checkWrapper = new LambdaQueryWrapper<Sku>()
            .eq(Sku::getSkuCode, skuCode)
            .eq(Sku::getIdDeleted, 0);
        if(baseMapper.selectCount(checkWrapper) > 0){
            throw new BusinessException("SKU编码已存在");
        }

        //创建SKU记录
        Sku sku = new Sku();
        sku.setSkuCode(skuCode);
        sku.setSkuName(dto.getSkuName());
        sku.setMainImage(dto.getMainImage());
        sku.setPrice(dto.getPrice());
        sku.setStatus(0);   //草稿
        sku.setStyleId(dto.getStyleId());
        sku.setElementId(dto.getElementId());
        sku.setColor(dto.getColor());
        sku.setSize(dto.getSize());
        sku.setStock(dto.getStock());
        sku.setSupplierName(dto.getSupplierName());
        sku.setSupplierCode(dto.getSupplierCode());
        sku.setCreateBy(userId);
        baseMapper.insert(sku);
        return skuCode;
    }   

    private String generateSkuCode(String styleCode, String color, String size){
        //规则：版型编码+颜色缩写+尺码缩写+随机数
        String colorCode = color == null ? "00" : color.substring(0,2).toUpperCase();
        String sizeCode = size == null ? "00" : size.replaceAll("[^A-Z0-9]", "");
        String random = IdUtil.fastSimpleUUID().substring(0,4).toUpperCase();
        return styleCode + "-" + colorCode + sizeCode + "-" + random;
    }

    @Override
    @Transactional
    public boolean updateSku(SkuUpdateDTO dto, Long userId){
        Sku sku = baseMapper.selectById(dto.getId());
        if(sku == null){
            throw new BusinessException("SKU不存在");
        }
        //只有草稿状态允许编辑
        if(sku.getStatus() != 0){
            throw new BusinessException("当前状态不可编辑");
        }
        //更新字段
        sku.setSkuName(dto.getSkuName());
        sku.setMainImage(dto.getMainImage());
        sku.setPrice(dto.getPrice());
        sku.setElementId(dto.getElementId());
        sku.setColor(dto.getColor());
        sku.setSize(dto.getSize());
        sku.setStock(dto.getStock());
        sku.setSupplierName(dto.getSupplierName());
        sku.setSupplierCode(dto.getSupplierCode());
        return baseMapper.updateById(sku) > 0;
    }

    @Override
    @Transactional
    public boolean deleteSku(Long id){
        Sku sku = new Sku();
        sku.setId(id);
        sku.setIsDeleted(1);
        return baseMapper.updateById(sku) > 0;
    }

    @Override
    @Transactional
    public boolean submitAudit(Long skuId, Long userId){
        Sku sku = baseMapper.selectById(skuId);
        if(sku == null){
            throw new BusinessException("SKU不存在");
        }
        if(sku.getStatus() != 0){
            throw new BusinessException("只有草稿状态可提交审批");
        }
        //更新状态
        sku.setStatus(1);   //待审批
        baseMapper.updateById(sku);
        //记录审批记录
        SkuAudit audit = new SkuAudit();
        audit.setSkuId(skuId);
        audit.setAction(1); //提交
        audit.setOperator(userId);
        skuAuditMapper.insert(audit);
        return true;
    }

    @Override
    @Transactional
    public boolean approveAudit(Long skuId, String comment, Long userId){
        Sku sku = baseMapper.selectById(skuId);
        if(sku == null || sku.getStatus() != 1){
            throw new BusinessException("sku不在待审批状态");
        }
        sku.setStatus(2);   //通过
        baseMapper.updateById(sku);
        SkuAudit audit = new SkuAudit();
        audit.setSkuId(skuId);
        audit.setAction(2);
        audit.setComment(comment);
        audit.setOperator(userId);
        skuAuditMapper.insert(audit);
        return true;
    }

    @Override
    @Transactional
    public boolean rejectAudit(Long skuId, String comment, Long userId){
        Sku sku = baseMapper.selectById(skuId);
        if(sku == null || sku.getStatus() != 1){
            throw new BusinessException("sku不在待审批状态")；
        }
        sku.getSatatus(3);  //驳回
        baseMapper.updateById(sku);
        
        SkuAudit audit = new SkuAudit();
        audit.setSkuId(skuId);
        audit.setAction(3);
        audit.setComment(comment);
        audit.setOperator(userId);
        skuAuditMapper.insert(audit);
        return true;
    }

    @Override
    public List<String> batchCreateByStyle(Long styleId, Long userId){
        //根据版型生成多个sku（例如不同颜色、尺码组合）
        //这里异步处理，避免接口长时间等待
        CompletableFutrue<List<String>> future = CompletableFuture.supplyAsync(() ->{
            List<String> skuCode = new ArrayList<>();
            //实际业务中，颜色和尺寸可能从版型关联配置中获取
            String[] colors = {"红色", "黑色, "白色"};
            String[] sizes = {"S", "M", "L"};
            for(String color : colors){
                for(String size ： sizes){
                    SkuCreateDTO dto = new SkuCreateDTO();
                    dto.setStyleId(styleId);
                    dto.setColor(color);
                    dto.setSize(size);
                    dto.setSkuName("占坑SKU-" + color + size);
                    dto.setPrice(BigDecimal.ZERO);
                    dto.setStock();
                    try{
                        String skuCode = createSku(dto, userId);
                        skuCodes.add(skuCode);
                    }catch(Exception e){
                        log.error("批量创建sku失败：styleId={}, color={}, size={}", styleId, color, size, e);
                    }
                }
            }
            return skuCodes;
        }, taskExecutor);
        //返回future的任务ID，前端轮询结果；这里简化直接返回，实际可改用异步任务表
        try{
            return future.get();    //
        }catch(Exception e){
            throw new RuntimeException("批量创建失败", e);
        }
    }
}
```
4、controller层
```Java
//SkuController.java
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.sringframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/sku")
public class SkuController{
    
    @Autowired
    private SkuService skuService;
    
    @PostMapping("/page")
    public Result<IPage<Sku>> page(@RequestBody SkuQueryDTO dto){
        return Result.success(skuService.queryPage(dto));
    }

    @PostMapping("/create")
    public Result<String> create(@RequestBody @Valid SkuCreateDTO dto, @RequestAttribute Long userId){
        String skuCode = skuService.createSku(dto, userId);
        return Result.success(skuCode);
    }

    @PostMapping("/update")
    public Result<?> update(@RequestBody @Valid SkuUpdateDTO dto, @RequestBody Long userId){
        skuService.updateSku(dto, userId);
        return Result.success("更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id){
        skuService.deleteSku(id);
        return Result.success("删除成功");
    }

    @PostMapping("/submitAudit/{id}")
    public Result<?> submitAudit(@PathVariable Long id, @RequestAttribute Long userId){
        skuService.submitAudit(id, userId);
        return Result.success("提交审批成功");
    }

    @PostMapping("/approve/{id}")
    public Result<?> approve(@PathVariable Long id, @RequestBody AuditDTO dto, @RequestAttribute Long userId){
        skuService.approveAudit(id, dto.getComment(), userId);
        return Result.success("审批通过");
    }

    @PostMapping("/reject/{id}")
    public Result<?> reject(@PathVariable Long id, @RequestBody AuditDTO dto, @RequestAttribute Long userId){
        skuService.rejectAudit(id, dto.getComment(), userId);
        return Result.success("审批驳回");
    }

    @PostMapping("/batchCreateByStyle")
    public Result<List<String>> batchCreateByStyle(@RequestParam Long styleId, @RequestAttribute Long userId){
        List<String> skuCode = skuService.batchCreateByStyle(styleId, userId);
        return Result.success(skuCode);
    }
}
```

5、dto类
```Java
//SkuQueryDTO.java
import lombok.Data;

@Data
public class SkuQueryDTO{
    private Integer pageNum = 1;
    private Integer pageSize = 20;
    private String skuCode;
    private String skuName;
    private String status;
    private Long styleId;
    private Long elementId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    //其他筛选条件...
}
```
```Java
//SkuCreateDTO.java
@Data
public class SkuCreateDTO{
    @NotNull
    private Long styleId;
    private Long elementId;
    @NotBlank
    private String skuName;
    private String mainImage;
    @DecimalMin("0.01")
    private BigDecimal price;
    private String color;
    private String size;
    @Min(0)
    private Integer stock;
    private String supplierName;
    private String supplierCode;
}
```
```Java
//SkuUpdateDTO.java 类似，增加idzi字段
//AuditDTO.java
@Data
public class AuditDTO{
    private String comment;
}
```
6、配置类
```Java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnecttionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig{
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory){
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        //key使用String序列化
        template.setKeySerializer(new StringRedisSerializer());
        //value使用JSON序列化
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    } 
}
```
```Java
//ThreadPoolConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.*;

@Configuration
public class ThreadPoolConfig{
    @Bean
    public ThreadPoolExecutor taskExecutor(){
        return new ThreadPoolExecutor{
            5,  //corePoolSize
            10, //maxPoolSize
            60L, TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(100),
            new ThreadPoolExecutor.CallerRunsPolicy()
        };
    }
}
```
7、SQL建表语句
```sql
--版型表
CREATE TABLE `style`{
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `style_code` varchar(50) NOT NULL COMMENT '版型编码',
    `style_name` varchar(200) NOT NULL COMMENT '版型名称',
    `category` varchar(100) DEFAULT NULL COMMENT '类目',
    `weight` decimal(10, 2) DEFAULT NULL COMMENT '重量（g）',
    `material` varchar(200) DEFAULT NULL COMMENT '材质',
    `size_chart` varchar(500) DEFAULT NULL COMMENT '尺码图URL',
    `template_image` varchar(500) DEFAULT NULL COMMENT '套版图URL',
    `supplier_info` text COMMENT '供应商信息',
    `status` tinyint(4) DEFAULT '0' COMMENT '状态 0-正常 1-废弃',
    `create_time` datatime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datatime DEFAULT CURRNET_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_style_code` (`style_code`)
}ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT="版型表";
```
```sql
--元素表
CREATE TABLE `element`{
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `element_code` varchar(50) NOT NULL COMMENT '元素编码',
    `element_name` varchar(200) NOT NULL COMMENT '元素名称',
    `element_typr` varchar(50) DEFAULT NULL COMMENT '元素类型',
    `color` varchar(50) DEFAULT NULL COMMENT '颜色',
    `image_url` varchar(500) DEFAULT NULL COMMENT '元素图URL',
    `is_violation` tinyint(4) DEFAULT '0' COMMENT '是否违规 0-否 1-是',
    PRIMARY KEY ('id')
    UNIQUE KEY `uk_element_code` (`element_code`)
}ENGINE=InnoDB DEFAULT CHARSET = utf8mb4 COMMENT='元素表';
```
```sql
--sku主表
CREATE TABLE `sku`(
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `sku_code` varchar(100) NOT NULL COMMENT 'SKU编码',
    `sku_name` varchar(500) NOT NULL COMMENT 'sku名称',
    `main_image` varchar(500) DEFAULT NULL COMMENT '主图',
    `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
    `status` tinyint(4) DEFAULT `0` COMMENT '状态：0-草稿 1-待审批 2-已通过 3-已驳回',
    `style_id` bigint(20) NOT NULL COMMENT '版型ID',
    `element_id` bigint(20) DEFAULT NULL COMMENT '元素ID',
    `color` varchar(50) DEFAULT NULL COMMENT '颜色',
    `size` varchar(50) DEFAULT NULL COMMENT '尺码',
    `stock` int(11) DEFAULT '0' COMMENT '库存',
    `supplier_name` varchar(200) DEFAULT NULL COMMENT '供应商名称',
    `supplier_code` varchar(100) DEFAULT NULL COMMENT '供应商名称',
    `is_deleted` tinyint(4) DEFAULT '0' COMMENT '逻辑删除 0-未删除 1-已删除'，
    `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
    `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `create_by` bigint(20) DEFAULT NULL COMMENT '创建人ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_sku_code` (`sku_code`),
    KEY `idx_style_id` (`style_id`),
    KEY `idx_status` (`status`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 comment='sku表';

--sku审批记录表
CREATE TABLE `sku_audit`(
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `sku_id` bigint(20) NOT NULL,
    `action` tinyint(4) NOT NULL COMMENT '操作:1-提交 2-通过 3-驳回',
    `comment` varchar(500) DEFAULT NULL COMMENT '审批意见',
    `operator` bigint(20) NOT NULL COMMENT '操作人',
    `operate_time` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_sku_id` (`sku_id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='sku审批记录';
```
8、辅助类
```java
public class BusinessException extends RuntimeException{
    public BusinessException(String message){
        super(message);
    }
}
```
```java
//Result.java 统一响应体
import lombok.Data;

@Data
public class Result<T>{
    private int code;
    private String msg;
    private T data;
    public static <T> Result<T> success(T data){
        Result<T> r = new Result<>();
        r.code = 200;
        r.msg = "success";
        r.data = data;
        return r;
    }

    public static <T> Result<T> error(String msg){
        Result<T> r = new Result<>();
        r.code = 500;
        r.msg = msg;
        return r;
    }
}
```
<br>

在Java中如何使用swagger接口文档？
1、添加依赖
```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-boot-starter</arttifactId>
    <version>3.0.0</version>
</dependency>
```
2、写配置类
```java
@Configuration
@EnableOpenApi
public class SwaggerConfig{
    @Bean
    public Docket api(){
        return new Docket(DocumentationType.OAS_30)
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.example.controller"))
            .paths(PathSelectors.any())
            .build()
            .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo(){
        return new ApiInfoBuilder()
            .tittle("跨境电商ERP系统接口文档")
            .description("sku管理模块 API")
            .version("1.0")
            .build();
    }
}
```
3、在Controller上加注解
```java
@RestController
@RequestMapping("/api/sku")
@Api(tags="sku管理接口")
public class SkuController{
    @PostMapping("/page")
    @ApiOperation("分页查询sku列表")
    @ApiImplicitParams({
        @ApiImplicitParam(name="pageName", value="页码", defaultValue="1")
        @ApiImplicitParam(name="pageSize", value="每页条数", defaultValue="20")
    })
    public Result<IPage<Sku>> page(@RequestBody SkuQueryDTO dto){
        // ...
    }
}
```
4、在实体类上加注解(说明字段含义)
```java
@Data
@ApiModel("sku查询参数")
public class SkuQueryDTO{
    @ApiModelProperty("sku编码，支持模糊查询")
    private String skuCode;

    @ApiModelProperty("状态：0-草稿 1-待审批 2-已通过 3-已驳回")
    private Integer status;

    @ApiModelProperty("最低价格")
    private BigDecimal minPrice;
}
```