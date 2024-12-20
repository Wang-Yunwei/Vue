## 麦迪斯顿 - 院前急救服务

- Swagger3地址
  ``http://127.0.0.1:20210/phfa/swagger-ui/index.html
  ``
- Smart-doc地址
  ``http://127.0.0.1:20220/phfa/index.html
  ``

```text
{
  "serverUrl": "http://127.0.0.1", //设置服务器地址,非必须
  "isStrict": false, //是否开启严格模式
  "allInOne": true,  //是否将文档合并到一个文件中，一般推荐为true
  "outPath": "D://md2", //指定文档的输出路径
  "coverOld": true,  //是否覆盖旧的文件，主要用于mardown文件覆盖
  "packageFilters": "",//controller包过滤，多个包用英文逗号隔开
  "md5EncryptedHtmlName": false,//只有每个controller生成一个html文件是才使用
  "projectName": "smart-doc",//配置自己的项目名称
  "skipTransientField": true,//目前未实现
  "showAuthor":true,//是否显示接口作者名称，默认是true,不想显示可关闭
  "requestFieldToUnderline":true, //自动将驼峰入参字段在文档中转为下划线格式,//@since 1.8.7 版本开始
  "responseFieldToUnderline":true,//自动将驼峰入参字段在文档中转为下划线格式,//@since 1.8.7 版本开始
  "inlineEnum":true,//设置为true会将枚举详情展示到参数表中，默认关闭，//@since 1.8.8版本开始
  "recursionLimit":7,//设置允许递归执行的次数用于避免栈溢出，默认是7，正常为3次以内，//@since 1.8.8版本开始
  "ignoreRequestParams":[ //忽略请求参数对象，把不想生成文档的参数对象屏蔽掉，@since 1.9.2
      "org.springframework.ui.ModelMap"
  ],
  "dataDictionaries": [ //配置数据字典，没有需求可以不设置
    {
      "title": "http状态码字典", //数据字典的名称
      "enumClassName": "com.power.common.enums.HttpCodeEnum", //数据字典枚举类名称
      "codeField": "code",//数据字典字典码对应的字段名称
      "descField": "message"//数据字典对象的描述信息字典
    }
  ],

  "errorCodeDictionaries": [{ //错误码列表，没有需求可以不设置
    "title": "title",
    "enumClassName": "com.power.common.enums.HttpCodeEnum", //错误码枚举类,如果是枚举是在一个类中定义则用$链接类BaseErrorCode$Common
    "codeField": "code",//错误码的code码字段名称
    "descField": "message"//错误码的描述信息对应的字段名
  }],

  "revisionLogs": [ //设置文档变更记录，没有需求可以不设置
    {
      "version": "1.0", //文档版本号
      "status": "update", //变更操作状态，一般为：创建、更新等
      "author": "author", //文档变更作者
　　　　"revisionTime": "2020-09-24", //变更时间
      "remarks": "desc" //变更描述
    }
  ],
  "customResponseFields": [ //自定义添加字段和注释，api-doc后期遇到同名字段则直接给相应字段加注释，非必须
    {
      "name": "code",//覆盖响应码字段
      "desc": "响应代码",//覆盖响应码的字段注释
      "value": "00000"//设置响应码的值
    }
  ],
  "requestHeaders": [ //设置请求头，没有需求可以不设置
    {
      "name": "token",
      "type": "string",
      "desc": "desc",
      "required": false,
      "value":"55",
      "since": "-"
    }
  ],
  "rpcApiDependencies":[{ // 项目开放的dubbo api接口模块依赖，配置后输出到文档方便使用者集成
      "artifactId":"SpringBoot2-Dubbo-Api",
      "groupId":"com.demo",
      "version":"1.0.0"
  }],
  "rpcConsumerConfig":"src/main/resources/consumer-example.conf",//文档中添加dubbo consumer集成配置，用于方便集成方可以快速集成
  "apiObjectReplacements": [{ // 自smart-doc 1.8.5开始你可以使用自定义类覆盖其他类做文档渲染，使用全类名
      "className": "org.springframework.data.domain.Pageable",
      "replacementClassName": "com.power.doc.model.PageRequestDto" //自定义的PageRequestDto替换Pageable做文档渲染
  }],
  "apiConstants": [{//从1.8.9开始配置自己的常量类，smart-doc在解析到常量时自动替换为具体的值,如：http://localhost:8080/testConstants/+ApiVersion.VERSION中的ApiVersion.VERSION会被替换
      "constantsClassName": "com.power.doc.constants.RequestParamConstant"
  }],
  "sourceCodePaths": [ //设置代码路径，smart-doc默认会自动加载src/main/java, 没有需求可以不设置 1.0.0以后版本此配置不再生效
    {
      "path": "src/main/java",
      "desc": "测试"
    }
  ]
}
```