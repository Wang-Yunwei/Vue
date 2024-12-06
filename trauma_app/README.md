# TRAUMA - APP

## 创伤 APP 结构目录

```text
app
    ├─ document  // 档案
            ├─ list  // 首页列表
                    ├─ index.vue  // 引入add
                    ├─ add.vue
                            ├─ index.vue
                            ├─ patientList.vue  // 患者列表
                            └─ addPatient.vue  // 新增患者
                    └─ tabs
                            ├─ index.js
                            ├─ all.vue  // 全部
                            ├─ filling.vue  // 填报中
                            ├─ pending.vue  // 待审核
                            ├─ toBeArchived.vue  // 待存档
                            └─ archived.vue  // 已存档
            └─ detail
                    ├─ index.vue
                    ├─ basicInfo.vue  // 患者信息卡片
                    ├─ document  //档案
                            ├─ index.vue
                            ├─ tabs
                            └─ // ...
                    ├─ timeCollection  // 时间采集
                            ├─ index.vue
                            ├─ tabs
                            └─ // ...
                    └─ timeLine  // 时间轴
                            └─ index.vue
    ├─ pre-hospitalPush  // 院前推送
    └─ qualityControl  // 质控
```
