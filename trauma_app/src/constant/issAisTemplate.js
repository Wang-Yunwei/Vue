export const issAis = () => [
    {
        "image": require('@assets/image/头颈部.png'),
        "name": "头颈部",
        "value": 0,
        "oneList": [
            {
                "parent": "头颈部",
                "name": "血管",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧颅内颈内/颅内椎动脉/乙状窦裂伤" },
                            { "subTitle": "双侧开放性的横窦裂伤" },
                            { "subTitle": "横窦窦汇开放性裂伤" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            {
                                "subTitle": "裂伤",
                                "subContent": [
                                    "大脑前/中/后/基底/颅内颈内/颅内椎动脉，或开放性的海绵窦/乙状窦/直窦/上矢状窦/横窦，或双侧的乙状窦/横窦"
                                ]
                            },
                            {
                                "subTitle": "血栓/闭塞",
                                "subContent": [
                                    "基底动脉/直窦/上矢状窦后部，双侧的大脑中/颅内颈内/颈部椎动脉/乙状窦/横窦",
                                    "基底动脉创伤性动脉瘤",
                                    "颈总/颈部颈内动脉损伤重度/破裂/横断/节段性缺损/失血>20%的任一项伴与头伤无关的神经功能异常（卒中）",
                                    "双侧颈部椎动脉损伤重度/破裂/横断/失血>20%的任一项伴与头伤无关的神经功能异常（卒中）"]
                            }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "基底动脉/乙状窦/直窦损伤NFS" },
                            { "subTitle": "颈动脉-海绵状血管瘘" },
                            {
                                "subTitle": "裂伤",
                                "subContent": ["海绵窦/乙状窦/直窦/上矢状窦/横窦/大脑有名静脉，或大脑前/中/后/基底/颅内椎动脉的分支"]
                            },
                            {
                                "subTitle": "血栓/闭塞",
                                "subContent": [
                                    "大脑中 颅内颈内/颈部椎动脉/乙状窦/上矢状窦前部/横窦，或双侧的大脑前/后/颅内椎动脉",
                                    "颈总/颈部颈内动脉损伤重度/破裂/横断/节段性缺损/失血 > 20 %",
                                    "颈总/颈部颈内动脉内膜撕裂/血栓/闭塞/轻度/浅表裂伤/穿孔/穿刺伤的任一项伴与头伤无关的神经功能异常（卒中）",
                                    "颈部椎动脉损伤重度/破裂/横断/失血 > 20 % 的任一项伴与头伤无关的神经功能异常（卒中）;"]
                            }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颅血管损伤NFS（除基底动脉/乙状窦/直窦）" },
                            {
                                "subTitle": "血栓/闭塞",
                                "subContent": [
                                    "大脑前/中/后/基底/颅内椎动脉的分支，或大脑前 / 后 / 颅内椎 / 颈总 / 颈部颈内动脉 / 海绵窦 / 大脑有名静脉"
                                ]
                            },
                            {
                                "subTitle": "创伤性动脉瘤",
                                "subContent": [
                                    "大脑前/中/后/基底/颅内椎动脉的分支，或大脑前/中/后/颅内颈内/颅内椎动脉; 颈总 / 颈部颈内动脉损伤NFS / 内膜撕裂 / 轻度 / 浅表裂伤 / 穿孔 / 穿刺伤", "颈部椎/颈外动脉/颈内/外静脉损伤重度/破裂/横断/节段性缺损/失血 > 20 %",
                                    "颈部椎动脉内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤的任一项伴与头伤无关的神经功能异常（卒中）;"
                                ]
                            }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈外/颈部椎动脉损伤NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "颈外动脉血栓/闭塞" },
                            { "subTitle": "颈内静脉轻度/浅表裂伤/穿孔/穿刺伤" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈内/外静脉损伤NFS" },
                            { "subTitle": "颈外静脉轻度 / 浅表裂伤 / 穿孔 / 穿刺伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "神经和颈髓",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "C3或以上颈髓损伤" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈髓挫伤致完全性脊髓损伤综合征 (四肢或截瘫，且无感觉功能)" },
                            { "subTitle": "颈髓裂伤NFS/ 穿透伤 / 横断 / 挤压伤" }]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧颈部膈神经损伤" },
                            { "subTitle": "双侧完全性臂丛损伤" },
                            { "subTitle": "iss颈髓挫伤致不全性脊髓损伤综合征(残留部分感觉或运动，前束、中束、侧束、半切综合征)" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧的VII/VIII脑神经挫/裂伤" },
                            { "subTitle": "完全性臂丛损伤" },
                            { "subTitle": "颈髓挫伤NFS/ 伴一过性神经体征 (感觉异常)" },
                            { "subTitle": "多根神经根裂伤或撕脱" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "～XII脑神经NFS/挫/裂伤 (除外X的颈腹段)" },
                            { "subTitle": "颈部膈神经损伤" },
                            { "subTitle": "臂丛NFS/ 不全损伤" },
                            { "subTitle": "神经根NFS / 挫伤 / 牵拉 / 单根裂伤 / 单根撕脱" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈部神经损伤NFS" },
                            { "subTitle": "迷走神经损伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "器官",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "头部离断" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈段食管/喉/咽/咽后：撕脱/破裂/横断/广泛毁损" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈段食管穿孔/全层裂伤/裂伤>50%周径/吞咽性损伤管壁全层坏死" },
                            { "subTitle": "累及声带的喉裂伤/穿刺伤" },
                            { "subTitle": "咽/咽后：穿孔/全层裂伤" },
                            { "subTitle": "颈段气管撕脱/破裂/横断/广泛毁损/喉-气管分离" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈部穿透伤伴失血>20%" },
                            { "subTitle": "颈段食管裂伤NFS/非全层裂伤/裂伤≤50%周径/吞咽性损伤管壁非全层坏死" },
                            { "subTitle": "喉穿孔/全层裂伤；咽/咽后：重度挫伤/挫伤气道受累>75%/非全层裂伤/穿刺伤未穿孔/粘膜裂伤" },
                            { "subTitle": "唾液腺管受累 / 横断" },
                            { "subTitle": "颈段气管穿孔 / 全层裂伤 / 折断" },
                            { "subTitle": "双侧声带损伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈部穿透伤伴组织缺失>100cm²" },
                            { "subTitle": "颈段食管NFS/挫伤/血肿" },
                            { "subTitle": "喉NFS/挫伤/血肿/非全层裂伤/穿刺伤未穿孔/粘膜撕裂" },
                            { "subTitle": "咽/咽后：NFS/血肿/轻度挫伤/挫伤气道受累≤75%" },
                            { "subTitle": "唾液腺损伤NFS" },
                            { "subTitle": "甲状腺裂伤;颈段气管NFS/血肿/挫伤/非全层裂伤" },
                            { "subTitle": "声带NFS/单侧损伤" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈部穿透伤NFS/轻度/深入胸膜腔未累及深部结构" },
                            { "subTitle": "甲状腺NFS/挫伤/血肿" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "脑组织 (含病变周围水肿) 透伤",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "iss脑干裂伤/挤压毁损/穿透伤/横断伤" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑挫伤＞30ml/穿透伤深>2cm" },
                            { "subTitle": "大脑挫伤＞50ml/30ml (≤10岁) /穿透伤深>2cm" },
                            { "subTitle": "脑干NFS/挫伤/梗塞/出血/压迫 (含天幕或小脑扁桃体疝)" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑挫伤15-30ml或直径＞3cm/裂伤长或深>2cm" },
                            { "subTitle": "大脑挫伤30-50ml/15-30ml（≤10岁）/直径>4cm/2-4cm（≤10岁，不含2cm）/中线移位>5mm//裂伤长或深>2cm" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑损伤NFS/挫伤≤15ml/直径1-3cm/裂伤长或深≤2cm/穿透伤深≤2cm/肿胀或水肿NFS/梗塞/缺血性脑损害/" },
                            { "subTitle": "大脑损伤NFS/挫伤≤30ml/15ml（≤10岁）/直径1-4cm/1-2cm（≤10岁）/中线移位≤5mm/裂伤长或深≤2cm/穿透伤深≤2cm" },
                            { "subTitle": "大脑梗塞" },
                            { "subTitle": "脑垂体损伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小/大脑挫伤直径<1cm" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "脑血肿(含病变周围水肿)",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑硬膜外/下血肿＞30ml/>15ml（≤10岁）/厚度＞1cm" },
                            { "subTitle": "小脑内血肿＞15ml/直径＞1cm" },
                            { "subTitle": "大脑硬膜外/下血肿＞50ml/25ml（≤10岁）/厚度>1cm" },
                            { "subTitle": "双侧大脑硬膜外血肿" },
                            { "subTitle": "大脑内血肿>30ml/15ml（≤10岁）/直径>4cm/1cm（≤10岁）" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑硬膜外/下血肿≤30ml/15ml（≤10岁）/厚度0.6-1cm" },
                            { "subTitle": "小脑内血肿≤15ml/直径0.6-1cm" },
                            { "subTitle": "大脑硬膜外/下血肿≤50ml/25ml（≤10岁）/厚度0.6-1cm" },
                            { "subTitle": "大脑内点状出血伴昏迷>6h" },
                            { "subTitle": "大脑内血肿≤30ml/15ml（≤10岁）/直径1-4cm/≤1cm（≤10岁）" },
                            { "subTitle": "大脑皮质下出血伴昏迷>6h" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "大/小脑内/硬膜外/硬膜下血肿/出血NFS" },
                            { "subTitle": "大脑硬膜下（包括天幕）血肿厚度<0.6cm" },
                            { "subTitle": "大脑蛛网膜下腔/软脑膜下出血伴昏迷>6h" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "小脑硬膜外/下血肿厚度<0.6cm" },
                            { "subTitle": "小脑内血肿直径<0.6cm" },
                            { "subTitle": "小脑蛛网膜下腔/软脑膜出血" },
                            { "subTitle": "大脑内血肿直径<1cm" },
                            { "subTitle": "大脑皮质下出血无昏迷/昏迷≤6h" },
                            { "subTitle": "大脑硬膜外血肿厚度<0.6cm" },
                            { "subTitle": "大脑蛛网膜下腔/软脑膜下出血NFS/无昏迷/昏迷≤6h" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "脑室",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "重度脑肿胀或水肿/脑室或脑干池消失" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "中度脑肿胀或水肿/脑室+脑干池受压" },
                            { "subTitle": "脑室内出血伴昏迷> 6h" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脑肿胀或水肿NFS/轻度/脑室受压且无脑干池受压" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脑室内出血无昏迷/昏迷≤6h" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "意识",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "大脑弥漫性轴突损伤累及胼胝体/意识丧失>24h（伴或不伴脑干征）" },
                            { "subTitle": "缺血性脑损伤伴昏迷> 6h" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "大脑弥漫性轴突损伤NFS/限于脑白质或基底节/意识丧失6-24h（不含6h）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脑震荡意识丧失1-6h（含1和6h）" },
                            { "subTitle": "缺血性脑损伤无昏迷/ 昏迷≤6h" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脑震荡意识丧失<1h" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "头部外伤NFS/仅头痛" },
                            { "subTitle": "脑震荡NFS/ 无意识丧失" }
                        ]
                    }
                ]
            },
            {
                "parent": "头颈部",
                "name": "骨骼、颈椎及附件",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颅脑挤压伤广泛毁损" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颅骨穿透伤深度>2cm" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "开放性伴脑组织外露或丢失的穹隆/颅底骨折" },
                            { "subTitle": "环状/ 折铰形颅底骨折" },
                            { "subTitle": "穹隆骨折凹陷＞2cm" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穹隆骨折粉碎/哆开（硬膜完好）/移位/凹陷≤2cm" },
                            { "subTitle": "颅底骨折NFS/有/无脑脊液漏" },
                            { "subTitle": "颅骨穿透伤NFS/深度≤2cm" },
                            { "subTitle": "颅腔积气" },
                            { "subTitle": "颈椎间盘突出伴神经根损伤" },
                            { "subTitle": "椎间盘破裂" },
                            { "subTitle": "寰枢（齿状突）/寰枕关节脱位" },
                            { "subTitle": "双侧小关节突脱位或半脱位" },
                            { "subTitle": "椎体前部压缩>20%/齿状突骨折" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穹隆NFS/闭合/无移位/裂缝/线型骨折" },
                            { "subTitle": "舌骨骨折" },
                            { "subTitle": "颈椎间盘损伤NFS/突出/半脱位/脱位/单侧小关节突脱位或半脱位/颈椎骨折NFS/椎体前部压缩≤20%/棘突/横突/小关节突/椎板/椎弓根骨折" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "棘间韧带裂伤" },
                            { "subTitle": "颈椎急性扭伤" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "image": require('@assets/image/面部.png'),
        "name": "面部",
        "value": 0,
        "oneList": [
            {
                "parent": "面部",
                "name": "血管",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈外动脉分支重度裂伤/伴失血>20%" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "颈外动脉分支NFS/轻度裂伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "面部",
                "name": "神经",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧视神经眶内段裂/撕脱伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "视神经眶内段损伤NFS/挫/裂/撕脱伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "面部",
                "name": "器官",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧眼撕脱/剜出" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧内耳或中耳损伤" },
                            { "subTitle": "双侧听骨链脱位" },
                            { "subTitle": "眼撕脱/剜出" },
                            { "subTitle": "黄斑裂孔" },
                            { "subTitle": "巩膜裂伤" },
                            { "subTitle": "舌深部/广泛裂伤" },
                            { "subTitle": "颞颌关节脱位" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "耳损伤NFS/耳道损伤" },
                            { "subTitle": "内耳或中耳损伤导致眩晕/耳鸣" },
                            { "subTitle": "听骨链脱位" },
                            { "subTitle": "鼓膜破裂" },
                            { "subTitle": "前庭器官损伤" },
                            { "subTitle": "除2或3分的其他眼损伤" },
                            { "subTitle": "口腔/腭/齿龈挫/裂/撕脱伤" },
                            { "subTitle": "舌轻度裂伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "面部",
                "name": "穿透伤",
                "value": 0,
                "twoList": [
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "全面部广泛毁损（含双眼）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤伴失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤伴组织缺失>100cm²" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤NFS/浅表轻度" }
                        ]
                    }
                ]
            },
            {
                "parent": "面部",
                "name": "骨骼",
                "value": 0,
                "twoList": [
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "上颌骨骨折失血>20%" },
                            { "subTitle": "全面部骨折失血> 20 %" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "上颌骨骨折LeFort III型" },
                            { "subTitle": "眼眶骨折" },
                            { "subTitle": "全面部骨折" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "齿槽嵴骨折" },
                            { "subTitle": "下颌骨开放/ 明显移位 / 粉碎性骨折" },
                            { "subTitle": "上颌骨骨折LeFort I / II型" },
                            { "subTitle": "鼻开放 / 明显移位 / 粉碎性骨折" },
                            { "subTitle": "鼻中隔骨折" },
                            { "subTitle": "颧骨骨折KN VI型" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "面部骨折NFS" },
                            { "subTitle": "下颌骨闭合性骨折" },
                            { "subTitle": "鼻衄" },
                            { "subTitle": "鼻闭合性骨折" },
                            { "subTitle": "牙齿损伤" },
                            { "subTitle": "颧骨骨折KN I- V型" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "image": require('@assets/image/胸部.png'),
        "name": "胸部、胸椎、横膈",
        "value": 0,
        "oneList": [
            {
                "parent": "胸部、胸椎、横膈",
                "name": "血管",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸主动脉裂伤伴不局限于纵隔的出血" },
                            { "subTitle": "双侧肺动/静脉重度裂伤/破裂/完全横断/节段性缺损/失血>20%" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸主动脉内膜撕裂累及主动脉瓣" },
                            { "subTitle": "胸主动脉/肺动/静脉重度裂伤/破裂/完全横断/节段性缺损/失血>20%" },
                            { "subTitle": "冠脉裂伤/冠脉左/右主干/左前降支/冠状窦血栓形成" },
                            { "subTitle": "头臂静脉/胸段腔静脉重度裂伤伴肺气栓" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸主动脉NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "头臂/ 锁骨下动 / 静脉 / 胸段腔静脉重度裂伤 / 破裂 / 完全横断 / 节段性缺损 / 失血 > 20 %" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "头臂/锁骨下/肺动/静脉/胸段腔静脉NFS/轻度/浅表裂伤/穿孔/穿刺伤" },
                            {
                                "subTitle": "头臂/ 锁骨下 / 肺动脉内膜撕裂",
                                "subContent": [
                                    "（其他有名动脉：支气管 / 食管 / 肋间 / 乳内，其他有名静脉：奇 / 半奇 / 乳内 / 支气管 / 食管 / 肋间 / 胸段颈内静脉）重度裂伤 / 破裂 / 完全横断 / 节段性缺损 / 失血 > 20 % "
                                ]
                            }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "其他有名动脉（支气管/食管/肋间/乳内）NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "其他有名静脉（奇/ 半奇 / 乳内 / 支气管 / 食管 / 肋间 / 胸段颈内静脉）NFS / 轻度 / 浅表裂伤 / 穿孔 / 穿刺伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "神经",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脊脊髓挫伤致完全性脊髓损伤综合征（截瘫且无感觉功能）" },
                            { "subTitle": "脊髓裂伤NFS/穿透伤/横断/挤压伤" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脊髓挫伤致不全性脊髓损伤综合征（残留部分感觉或运动，前束、中束、侧束、半切综合征）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脊髓挫伤NFS/伴一过性神经体征（感觉异常）" },
                            { "subTitle": "多根神经根裂伤或撕脱" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "神经根NFS/挫伤/牵拉/单根裂伤/单根撕脱" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "迷走神经损伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "器官、胸膜腔",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "双侧全胸部骨骼血管器官组织的广泛挤压毁损" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "张力性气胸" },
                            { "subTitle": "空气栓塞" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "开放性（吸吮性）胸部伤" },
                            { "subTitle": "重度血胸（血气胸）/至少1侧>1000ml" },
                            { "subTitle": "重度气胸/肺压缩>50%/持续漏气" },
                            { "subTitle": "重度血气胸" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤伴血/气胸/失血>20%" },
                            { "subTitle": "血胸NFS" },
                            { "subTitle": "纵隔积气伴心包填塞" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "女性乳房撕脱伤" },
                            { "subTitle": "穿透伤伴组织缺失>100cm²" },
                            { "subTitle": "胸膜/胸导管裂伤" },
                            { "subTitle": "气胸NFS" },
                            { "subTitle": "纵隔积血/气" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤NFS/浅表/轻度/深入胸膜腔未累及深部结构" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "肺",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肺吸入性损伤伴粘膜脱落/坏死/内皮消失" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "支气管主干复杂性裂伤/撕脱/破裂/横断/分离" },
                            { "subTitle": "胸段气管撕脱/破裂/横断/广泛毁损/喉-气分离" },
                            { "subTitle": "重度肺爆震伤" },
                            { "subTitle": "双肺爆震伤伴气栓" },
                            { "subTitle": "双肺裂伤重度/伴低氧血症/伴A-a梯度增高" },
                            { "subTitle": "肺吸入性损伤含以下情况（大量含碳物沉积/重度炎症伴脆性/重度支气管出血/支气管堵塞/低氧血症）" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "支气管主干（或胸段气管）穿孔/全层撕裂/折断" },
                            { "subTitle": "支气管主干远端复杂性裂伤/撕脱/破裂/横断/分离" },
                            { "subTitle": "肺爆震伤中度/伴出血" },
                            { "subTitle": "双肺挫伤（或单肺裂伤）重度/伴低氧血症/伴A-a梯度增高" },
                            { "subTitle": "双肺裂伤轻度/<1叶/不伴A-a梯度增高" },
                            { "subTitle": "肺吸入性损伤含以下情况（中度含碳物沉积/中度红斑/中度支气管出血）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "支气管主干（或胸段气管）NFS/挫伤/血肿/未穿孔裂伤/非全层撕裂" },
                            { "subTitle": "支气管主干远端穿孔/全层撕裂/折断" },
                            { "subTitle": "肺NFS/轻度爆震伤" },
                            { "subTitle": "单肺挫伤重度/伴低氧血症/伴A-a梯度增高" },
                            { "subTitle": "双肺挫伤（或单肺裂伤）轻度/<1叶/不伴A-a梯度增高" },
                            { "subTitle": "肺吸入性损伤含以下情况（含碳物沉积在支气管近端或终末/轻度或片状红斑/轻度支气管出血）" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "支气管主干远端未穿孔裂伤/非全层撕裂" },
                            { "subTitle": "单肺挫伤轻度/<1叶/不伴A-a梯度增高（A-a梯度：肺泡氧分压与动脉血氧分压之差）" },
                            { "subTitle": "肺吸入性损伤NFS/无以下情况（含碳物沉积/红斑/水肿/支气管出血/支气管堵塞）" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "支气管主干远端NFS/挫伤/血肿" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "膈食管",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸段食管撕脱/破裂/横断/广泛毁损" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "膈肌裂伤>10cm/伴明显组织缺失/破裂伴膈疝" },
                            { "subTitle": "胸段食管穿孔/全层裂伤/裂伤>50%周径/吞咽性损伤管壁全层坏死" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "膈肌裂伤≤10cm" },
                            { "subTitle": "胸段食管裂伤NFS/非全层裂伤/裂伤≤50%周径/吞咽性损伤管壁非全层坏死" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "膈肌/胸段食管NFS/挫伤/血肿" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "心脏",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心室破裂" },
                            { "subTitle": "多发性心房/室裂伤" },
                            { "subTitle": "单个心房/室组织缺损>50%" },
                            { "subTitle": "心脏撕脱伤" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心房/室穿孔/心房破裂" },
                            { "subTitle": "心内瓣膜/房/室间隔/腱索裂伤/破裂" },
                            { "subTitle": "心包疝" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心脏重度挫伤" },
                            { "subTitle": "心包积血伴心包填塞但无心脏损伤" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心脏裂伤未穿孔/未累及房室" },
                            { "subTitle": "心包积血NFS/无心包填塞/无心脏损伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心包NFS/裂伤/穿刺伤" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "心脏NFS/轻度挫伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "骨骼",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸壁（含胸廓）重度度撕脱伤（>15%）" },
                            { "subTitle": "双侧连枷胸" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸壁（含胸廓）轻度撕脱伤（≤15%）" },
                            { "subTitle": "单侧> 5根肋骨骨折伴连枷胸" }
                        ]
                    },
                    {
                        "value": 3, "isChecked": false,
                        "threeList": [
                            { "subTitle": "≥3根肋骨骨折" }, { "subTitle": "单侧连枷胸" }
                        ]
                    },
                    {
                        "value": 2, "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸骨骨折" },
                            { "subTitle": "多发肋骨骨折NFS" },
                            { "subTitle": "2根肋骨骨折" }
                        ]
                    },
                    {
                        "value": 1, "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸廓/胸壁/胸骨NFS/挫伤" },
                            { "subTitle": "单根肋骨骨折" }
                        ]
                    }
                ]
            },
            {
                "parent": "胸部、胸椎、横膈",
                "name": "胸椎、关节及附件",
                "value": 0, "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸椎间盘突出伴神经根损伤" },
                            { "subTitle": "椎间盘破裂" },
                            { "subTitle": "双侧小关节突脱位或半脱位" },
                            { "subTitle": "椎体前部压缩>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸椎间盘损伤NFS/突出/半脱位/脱位/单侧小关节突脱位或半脱位/胸椎骨折NFS/椎体前部压缩≤20%/棘突/横突/小关节突/椎板/椎弓根骨折" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "棘间韧带裂伤" },
                            { "subTitle": "胸椎急性扭伤" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "image": require('@assets/image/腹盆.png'),
        "name": "腹盆腔、腰椎",
        "value": 0,
        "oneList": [
            {
                "parent": "腹盆腔、腰椎",
                "name": "血管",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "腹主/腹腔/肠系膜上动脉重度裂伤/破裂/完全横断/节段性缺损/失血>20%" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "腹主动脉NFS/内膜撕裂" },
                            { "subTitle": "腹主/腹腔/肠系膜上动脉轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "髂动脉（含髂总/内/外）/其他有名动脉（肝/肾/脾）/髂总静脉/下腔静脉/其他有名静脉（门/肾/脾/肠系膜上）重度裂伤/破裂/完全横断/节段性缺损/失血>20%" },
                            { "subTitle": "双侧髂总动脉损伤" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "腹腔/肠系膜上动脉NFS/内膜撕裂" },
                            { "subTitle": "髂动脉（含髂总/内/外）/其他有名动脉（肝/肾/脾）NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "髂总/下腔静脉/其他有名静脉（门/肾/脾/肠系膜上）NFS/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "髂内/外静脉重度裂伤/破裂/完全横断/节段性缺损/失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "髂内/外静脉NFS/轻度/浅表裂伤/穿孔/穿刺伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "腹盆腔、腰椎",
                "name": "神经",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "脊髓挫伤致完全性脊髓损伤综合征（截瘫且无感觉功能）" },
                            { "subTitle": "脊髓裂伤NFS/穿透伤/横断/挤压伤" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "完全性马尾损伤综合征" },
                            { "subTitle": "脊髓挫伤致不全性脊髓损伤综合征（残留部分感觉或运动，前束、中束、侧束、半切综合征）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "马尾/脊髓挫伤NFS/伴一过性神经体征（感觉异常）/不全马尾损伤综合征" },
                            { "subTitle": "多根神经根裂伤或撕脱" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "神经根NFS/挫伤/牵拉/单根裂伤/单根撕脱" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "迷走神经损伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "腹盆腔、腰椎",
                "name": "腹部",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "躯干横断" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤伴失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false, "threeList": [
                            { "subTitle": "穿透伤伴组织缺失>100cm²" },
                            { "subTitle": "腹直肌哆裂NFS" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "穿透伤NFS/浅表/轻度/进腹膜但未累及深部" }
                        ]
                    }
                ]
            },
            {
                "parent": "腹盆腔、腰椎",
                "name": "空腔脏器和部分实质脏器",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "十二指肠/直肠广泛裂伤/复杂裂伤/撕脱/组织缺失/血供阻断" },
                            { "subTitle": "胰撕脱/广泛裂伤/复杂裂伤/组织缺失/胰头毁损/胰十二指肠结合部毁损" },
                            { "subTitle": "子宫破裂/撕脱/血供阻断/胎盘完全剥离" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肛门撕脱/广泛裂伤/复杂裂伤/破裂/大块组织缺损" },
                            { "subTitle": "膀胱撕脱/广泛裂伤/复杂裂伤/组织缺失/累及尿道口（膀胱三角）或膀胱颈" },
                            { "subTitle": "结肠/小肠撕脱/广泛裂伤/复杂裂伤/组织缺失/横断/血供阻断" },
                            { "subTitle": "十二指肠降段破裂>75%周径/累及壶腹部或胆总管下段" },
                            { "subTitle": "胆总管/肝管裂伤/横断" },
                            { "subTitle": "肠系膜撕脱/广泛裂伤/复杂裂伤/组织缺失" },
                            { "subTitle": "胰重度裂伤/多处裂伤/累及壶腹/近端横断" },
                            { "subTitle": "胎盘剥离>50%但未完全剥离/失血>20%" },
                            { "subTitle": "直肠裂伤延伸至会阴" },
                            { "subTitle": "胃撕脱/破裂/广泛裂伤/复杂裂伤/组织缺失/血供中断/吞咽性损伤管壁全层坏死" },
                            { "subTitle": "子宫裂伤累及子宫动脉" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾上腺撕脱/破裂/实质毁损>50%/广泛裂伤/复杂裂伤" },
                            { "subTitle": "肛门穿孔/全层裂伤" },
                            { "subTitle": "膀胱腹膜外裂伤>2cm/腹膜内裂伤/破裂NFS" },
                            { "subTitle": "结肠/小肠穿孔/全层裂伤/裂伤≥50%周径" },
                            { "subTitle": "十二指肠上段/水平段/升段裂伤50-100%周径（含50%、100%）/降段破裂50-75%周径（含50%、75%）" },
                            { "subTitle": "胆囊撕脱/广泛裂伤/复杂裂伤/破裂/组织缺失/胆囊管裂伤或横断" },
                            { "subTitle": "肠系膜/网膜重度裂伤/失血>20%" },
                            { "subTitle": "胰重度挫伤/大面积挫伤/广泛挫伤/胰管受累/中度裂伤/主要血管或主胰管受累/远端横断" },
                            { "subTitle": "会阴撕脱/广泛裂伤/复杂裂伤" },
                            { "subTitle": "前列腺裂伤累及尿道" },
                            { "subTitle": "直肠全层裂伤/裂伤>50%周径" },
                            { "subTitle": "胃穿孔/全层裂伤/吞咽性损伤管壁非全层坏死" },
                            { "subTitle": "输尿管撕脱/广泛裂伤/复杂裂伤/破裂/组织缺失/横断" },
                            { "subTitle": "尿道横断/分离>2cm/后尿道组织缺失" },
                            { "subTitle": "子宫裂伤>1cm/胎盘剥离≤50%" },
                            { "subTitle": "阴道/外阴撕脱/广泛裂伤/复杂裂伤" },
                            { "subTitle": "阴道裂伤累及子宫颈或腹膜" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾上腺挫伤重度/大面积" },
                            { "subTitle": "肾上腺裂伤重度/多处/深入髓质/≥2cm" },
                            { "subTitle": "肛门裂伤NFS/非全层裂伤" },
                            { "subTitle": "膀胱NFS/非全层裂伤/腹膜外裂伤≤2cm" },
                            { "subTitle": "结肠/小肠NFS/挫伤/血肿/非全层裂伤/裂伤<50%周径" },
                            { "subTitle": "十二指肠浆膜撕裂" },
                            { "subTitle": "胆囊NFS/挫伤/血肿/轻度裂伤/穿孔" },
                            { "subTitle": "肠系膜/网膜NFS/挫伤/血肿/轻度裂伤" },
                            { "subTitle": "输卵管裂伤" },
                            { "subTitle": "卵巢深部裂伤/裂伤>0.5cm/毁损/撕脱/广泛裂伤/复杂裂伤" },
                            { "subTitle": "胰轻度挫/裂伤/血肿" },
                            { "subTitle": "阴茎重度裂伤/广泛裂伤/离断/撕脱/复杂裂伤" },
                            { "subTitle": "会阴重度裂伤" },
                            { "subTitle": "前列腺裂伤" },
                            { "subTitle": "直肠NFS/挫伤/血肿/非全层裂伤/裂伤≤50%周径" },
                            { "subTitle": "阴囊重度裂伤/离断/撕脱/复杂裂伤" },
                            { "subTitle": "胃NFS/挫伤/血肿/非全层裂伤" },
                            { "subTitle": "睾丸撕脱/离断/广泛裂伤/复杂裂伤" },
                            { "subTitle": "输尿管NFS/挫伤/血肿/非全层裂伤" },
                            { "subTitle": "尿道损伤" },
                            { "subTitle": "子宫裂伤≤1cm/穿孔" },
                            { "subTitle": "阴道/外阴重度裂伤/深及脂肪或肌肉" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾上腺NFS/轻度/浅表挫/裂伤/血肿" },
                            { "subTitle": "肛门/前列腺/子宫NFS/挫伤/血肿" },
                            { "subTitle": "膀胱挫伤/血肿" },
                            { "subTitle": "卵巢NFS/挫伤/血肿/轻度裂伤/裂伤≤0.5cm" },
                            { "subTitle": "阴茎/会阴/阴囊/阴道/外阴NFS/挫伤/血肿/轻度裂伤/穿孔" },
                            { "subTitle": "阴囊裂伤<25cm" },
                            { "subTitle": "睾丸NFS/挫伤/血肿/轻度裂伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "腹盆腔、腰椎",
                "name": "重要实质脏器",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肝撕脱伤所有血管离断" }
                        ]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾门撕脱/全肾及血管毁损" },
                            { "subTitle": "肝实质破裂>肝叶的75%或一叶中>3个Couinard`s段受累或累及肝后腔静脉（或肝中静脉）/ 广泛裂伤 / 复杂裂伤" },
                            { "subTitle": "脾撕脱/广泛裂伤/组织缺失/脾门破裂致全脾血供阻断" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾裂伤延伸至皮质、髓质和集合系统/肾主要血管出血/重度裂伤/破裂" },
                            { "subTitle": "肝实质破裂≤肝叶的75%或一叶中1-3个Couinard`s段受累/ 裂伤多处深度 > 3cm / 爆裂性损伤 / 重度裂伤" },
                            { "subTitle": "脾门或脾段血管受累致全脾>25%血供阻断但无脾门损伤/脾重度裂伤" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾包膜下血肿面积>50%/扩展性血肿/重度挫伤/大面积挫伤/皮质裂伤深度>1cm且漏尿/中度裂伤" },
                            { "subTitle": "肝/脾包膜下血肿面积>50%/扩展性血肿/实质破裂/重度挫伤/实质裂伤深度>3cm/中度裂伤" },
                            { "subTitle": "肝实质内血肿直径>10cm/主要肝管受累/失血>20%" },
                            { "subTitle": "脾实质内血肿直径>5cm/破裂不累及脾门/小梁血管受累" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肾NFS/轻度挫伤/包膜下血肿/皮质裂伤深度≤1cm且无漏尿/轻度裂伤" },
                            { "subTitle": "腹膜后出血/血肿" },
                            { "subTitle": "肝/脾NFS/轻度挫伤/包膜下血肿面积≤50%/包膜撕裂/轻度裂伤" },
                            { "subTitle": "肝实质内血肿直径≤10cm/实质裂伤深度≤3cm或长度≤10cm" },
                            { "subTitle": "脾实质内血肿直径≤5cm/实质裂伤深度≤3cm" }
                        ]
                    }
                ]
            },
            {
                "parent": "腹盆腔、腰椎",
                "name": "胸椎、关节及附件",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸椎间盘突出伴神经根损伤" },
                            { "subTitle": "椎间盘破裂" },
                            { "subTitle": "双侧小关节突脱位或半脱位" },
                            { "subTitle": "椎体前部压缩>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "胸椎间盘损伤NFS/突出/半脱位/脱位/单侧小关节突脱位或半脱位/胸椎骨折NFS/椎体前部压缩≤20%/棘突/横突/小关节突/椎板/椎弓根骨折" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "棘间韧带裂伤" },
                            { "subTitle": "胸椎急性扭伤" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "image": require('@assets/image/四肢.png'),
        "name": "四肢骨盆臀部",
        "value": 0,
        "oneList": [
            {
                "parent": "四肢骨盆臀部",
                "name": "血管",
                "value": 0,
                "twoList": [
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "股动脉重度裂伤/破裂/完全横断/节段性缺损/失血>20%" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "有名动/静脉（除股动脉）重度裂伤/破裂/完全横断/节段性缺损/失血>20%" },
                            { "subTitle": "股动脉NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "腋/肱/腘动脉NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "腋/股/腘静脉轻度/浅表裂伤/穿孔/穿刺伤" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "腋静脉NFS" },
                            { "subTitle": "上肢有名静脉（除腋）NFS/轻度/浅表裂伤/穿孔/穿刺伤" },
                            { "subTitle": "有名动脉（除腋/肱/股/腘）NFS/内膜撕裂/轻度/浅表裂伤/穿孔/穿刺伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "四肢骨盆臀部",
                "name": "神经",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "坐骨神经裂伤" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "正中/桡/尺/股/腓总/胫神经裂伤/撕脱" },
                            { "subTitle": "坐骨/腓总神经NFS/挫伤" },
                            { "subTitle": "胫神经NFS" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "指/趾神经NFS/挫/裂伤" },
                            { "subTitle": "正中/桡/尺/股神经NFS/挫伤" },
                            { "subTitle": "胫神经挫伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "四肢骨盆臀部",
                "name": "软组织",
                "value": 0,
                "twoList": [
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肩至肘/髋、臀至膝部分或完全离断" },
                            { "subTitle": "肩至肘/髋、臀至膝挤压伤" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肘以下至腕/膝以下至踝部分或完全离断" },
                            { "subTitle": "骨筋膜室综合征伴肌肉坏死" },
                            { "subTitle": "肘以下至腕/膝以下至踝挤压伤" },
                            { "subTitle": "全上/下肢脱套伤" },
                            { "subTitle": "肩至肘/髋、臀至踝穿透伤伴失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "手/拇指/足/足趾部分或完全离断" },
                            { "subTitle": "骨筋膜室综合征" },
                            { "subTitle": "手/拇指/足/足趾挤压伤" },
                            { "subTitle": "部分脱套伤" },
                            { "subTitle": "穿透伤伴组织缺失>25cm²" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "手指部分或完全离断（除拇指）" },
                            { "subTitle": "手指挤压伤（除拇指）" },
                            { "subTitle": "浅表/轻度穿透伤" }
                        ]
                    }
                ]
            },
            {
                "parent": "四肢骨盆臀部",
                "name": "肌肉肌腱韧带",
                "value": 0,
                "twoList": [
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "跟腱/踝膝侧副韧带/交叉韧带/髌韧带/半月板/下肢、臀部肌腱撕裂/撕脱" },
                            { "subTitle": "下肢/臀部肌肉完全撕裂/撕脱" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "上肢关节囊裂伤/破裂/撕裂/撕脱" },
                            { "subTitle": "上肢肌肉撕裂/撕脱/挫伤/扭伤" },
                            { "subTitle": "下肢/臀部肌肉部分撕裂/撕脱" },
                            { "subTitle": "上肢肌腱撕裂/撕脱" }
                        ]
                    }
                ]
            },
            {
                "parent": "四肢骨盆臀部",
                "name": "关节",
                "value": 0,
                "twoList": [
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肘以上/桡腕/髋/膝/踝关节脱位" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肘以上/髋/膝/踝关节NFS/开放性损伤/扭伤/半脱位" },
                            { "subTitle": "肘及以下（除桡腕）/踝以下关节NFS/开放性损伤/扭伤/半脱位/脱位" }
                        ]
                    }
                ]
            },
            {
                "parent": "四肢骨盆臀部",
                "name": "骨骼",
                "value": 0,
                "twoList": [
                    {
                        "value": 5, "isChecked": false,
                        "threeList": [
                            { "subTitle": "开放性骨盆骨折后环完全损伤、盆底完全破坏/纵向不稳定" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "闭合性骨盆骨折后环万千损伤、盆地完全破坏/纵向不稳定" },
                            { "subTitle": "开放性骨盆骨折后环部分损伤（部分/纵向稳定）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "肱/桡/尺骨开放性骨折：非单纯骨干/累及关节（尺骨茎突除外）" },
                            { "subTitle": "股骨骨折" },
                            { "subTitle": "胫骨开放骨折" },
                            { "subTitle": "开放性骨盆环骨折NFS" },
                            { "subTitle": "开放性骨盆环稳定骨折后环完好" },
                            { "subTitle": "闭合性骨盆骨折后环部分损伤（纵向/部分稳定）" },
                            { "subTitle": "开放髋臼骨折" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "四肢骨折（除外1/3/4/5分的骨折）2分骨折详情" },
                            { "subTitle": "骨盆骨折NFS/稳定骨折后环完好" },
                            { "subTitle": "髋臼骨折" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "指/趾骨骨折" }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "image": require('@assets/image/体表.png'),
        "name": "体表其他",
        "value": 0,
        "oneList": [
            {
                "parent": "体表其他",
                "name": "头皮",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "失血＞20%" },
                            { "subTitle": "全头皮缺失" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "裂伤重度/＞20cm且深及皮下" },
                            { "subTitle": "撕脱伤重度/组织缺失＞100cm²" },
                            { "subTitle": "帽状腱膜下血肿（≤6月龄）" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/擦/挫伤" },
                            { "subTitle": "撕脱/裂伤" },
                            { "subTitle": "颅脑挤压伤广轻度/浅表泛毁损" },
                            { "subTitle": "撕脱组织缺失≤100cm²" },
                            { "subTitle": "帽状腱膜下血肿（>6月龄）" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "面部皮肤/皮下组织/肌肉",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "裂伤重度/>20cm深及皮下" },
                            { "subTitle": "撕脱伤重度/组织缺失>25cm²" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/擦/挫伤/血肿" },
                            { "subTitle": "撕脱/裂伤" },
                            { "subTitle": "轻度/浅表" },
                            { "subTitle": "撕脱组织缺失≤25cm²" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "颈胸腹部皮肤/皮下组织/肌肉",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "失血>20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "裂伤重度/>20cm且深及皮下" },
                            { "subTitle": "撕脱伤重度/组织缺失>100cm²" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS（腹直肌参考腹部）/擦/挫伤/血肿" },
                            { "subTitle": "撕脱/裂伤" },
                            { "subTitle": "轻度/浅表" },
                            { "subTitle": "撕脱组织缺失≤100cm²" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "四肢臀部皮肤/皮下组织",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "失血＞20%" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "裂伤重度/>20cm且深及皮下（手部>10cm）" },
                            { "subTitle": "撕脱伤重度/组织缺失>100cm²（手部>25cm²）" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/擦/挫伤/血肿" },
                            { "subTitle": "撕脱/裂伤" },
                            { "subTitle": "轻度/浅表" },
                            { "subTitle": "撕脱组织缺失≤100cm²（手≤25cm²）" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "烧伤",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "2或3°≥90%" }]
                    },
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "2或3°30-39%（<5岁）/2或3°40-89%（≥5岁）" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "2或3°20-29%（<5岁）/2或3°30-39%（≥5岁）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "2或3°20-29%（≥5岁）/2或3°10-19%（<5岁）" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "1°>50%（≤1岁）/2或3°10-19%（≥5岁）/3°>100cm²至10%（面部>25cm²）" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/1°（>1岁）/1°≤50%（≤1岁）/2°<10%/3°≤100cm²（面部≤25cm²）" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "冻伤",
                "value": 0,
                "twoList": [
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "身体多处" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "深度/全厚" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/I°/浅表" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "窒息",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "伴心脏停搏（医务人员证实）" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "伴神经功能障碍" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/无神经功能障碍" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "溺水",
                "value": 0,
                "twoList": [
                    {
                        "value": 6,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "伴心脏停搏（医务人员证实）" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "接近溺死伴神经功能障碍" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/接近溺死无神经功能障碍" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "高压电击伤",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "伴心脏停搏（医务人员证实）" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "伴肌肉坏死" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS" }
                        ]
                    }
                ]
            },
            {
                "parent": "体表其他",
                "name": "原发低体温",
                "value": 0,
                "twoList": [
                    {
                        "value": 5,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "<27℃" }
                        ]
                    },
                    {
                        "value": 4,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "28-29℃" }
                        ]
                    },
                    {
                        "value": 3,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "30-31℃" }
                        ]
                    },
                    {
                        "value": 2,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "32-33℃" }
                        ]
                    },
                    {
                        "value": 1,
                        "isChecked": false,
                        "threeList": [
                            { "subTitle": "NFS/>34-35℃" }
                        ]
                    }
                ]
            }
        ]
    }
]
export default issAis