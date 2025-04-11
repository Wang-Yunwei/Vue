export default function graceTemplate() {
  return [
    {
      id: 'itemAge',
      title: '年龄(岁)',
      value: '',
      key: 'age',
      controlType: 1, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemAge1',
          parentId: 'itemAge',
          title: '<30',
          key: '1',
          score: 0
        },
        {
          id: 'itemAge2',
          parentId: 'itemAge',
          title: '30-39',
          key: '2',
          score: 8
        },
        {
          id: 'itemAge3',
          parentId: 'itemAge',
          title: '40-49',
          key: '3',
          score: 25
        },
        {
          id: 'itemAge4',
          parentId: 'itemAge',
          title: '50-59',
          key: '4',
          score: 41
        },
        {
          id: 'itemAge5',
          parentId: 'itemAge',
          title: '60-69',
          key: '5',
          score: 58
        },
        {
          id: 'itemAge6',
          parentId: 'itemAge',
          title: '70-79',
          key: '6',
          score: 75
        },
        {
          id: 'itemAge7',
          parentId: 'itemAge',
          title: '≥80',
          key: '7',
          score: 91
        }
      ]
    },
    {
      id: 'itemHr',
      title: '心率(次/min)',
      value: '',
      key: 'hr',
      controlType: 1, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemHr1',
          parentId: 'itemHr',
          title: '<50',
          key: '1',
          score: 0
        },
        {
          id: 'itemHr2',
          parentId: 'itemHr',
          title: '50-69',
          key: '2',
          score: 3
        },
        {
          id: 'itemHr3',
          parentId: 'itemHr',
          title: '70-89',
          key: '3',
          score: 9
        },
        {
          id: 'itemHr4',
          parentId: 'itemHr',
          title: '90-109',
          key: '4',
          score: 15
        },
        {
          id: 'itemHr5',
          parentId: 'itemHr',
          title: '110-149',
          key: '5',
          score: 24
        },
        {
          id: 'itemHr6',
          parentId: 'itemHr',
          title: '150-199',
          key: '6',
          score: 38
        },
        {
          id: 'itemHr7',
          parentId: 'itemHr',
          title: '≥200',
          key: '7',
          score: 46
        }
      ]
    },
    {
      id: 'itemSbp',
      title: '收缩压(mmHg)',
      value: '',
      key: 'Sbp',
      controlType: 1, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemSbp1',
          parentId: 'itemSbp',
          title: '<80',
          key: '1',
          score: 58
        },
        {
          id: 'itemSbp2',
          parentId: 'itemSbp',
          title: '80-99',
          key: '2',
          score: 53
        },
        {
          id: 'itemSbp3',
          parentId: 'itemSbp',
          title: '100-119',
          key: '3',
          score: 43
        },
        {
          id: 'itemSbp4',
          parentId: 'itemSbp',
          title: '120-139',
          key: '4',
          score: 34
        },
        {
          id: 'itemSbp5',
          parentId: 'itemSbp',
          title: '140-159',
          key: '5',
          score: 24
        },
        {
          id: 'itemSbp6',
          parentId: 'itemSbp',
          title: '160-199',
          key: '6',
          score: 10
        },
        {
          id: 'itemSbp7',
          parentId: 'itemSbp',
          title: '≥200',
          key: '7',
          score: 0
        }
      ]
    },
    {
      id: 'itemScr',
      title: '肌酐(mg/dL)',
      value: '',
      key: 'Scr',
      controlType: 1, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemScr1',
          parentId: 'itemScr',
          title: '0-0.39',
          key: '1',
          score: 1
        },
        {
          id: 'itemScr2',
          parentId: 'itemScr',
          title: '0.4-0.79',
          key: '2',
          score: 4
        },
        {
          id: 'itemScr3',
          parentId: 'itemScr',
          title: '0.8-1.19',
          key: '3',
          score: 7
        },
        {
          id: 'itemScr4',
          parentId: 'itemScr',
          title: '1.2-1.59',
          key: '4',
          score: 10
        },
        {
          id: 'itemScr5',
          parentId: 'itemScr',
          title: '1.6-1.99',
          key: '5',
          score: 13
        },
        {
          id: 'itemScr6',
          parentId: 'itemScr',
          title: '2.0-3.99',
          key: '6',
          score: 21
        },
        {
          id: 'itemScr7',
          parentId: 'itemScr',
          title: '≥4',
          key: '7',
          score: 28
        }
      ]
    },
    {
      id: 'itemKillip',
      title: 'Killip分级',
      value: '',
      key: 'Killip',
      controlType: 1, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemKillip1',
          parentId: 'itemKillip',
          title: 'Ⅰ',
          key: '1',
          score: 0
        },
        {
          id: 'itemKillip2',
          parentId: 'itemKillip',
          title: 'Ⅱ',
          key: '2',
          score: 20
        },
        {
          id: 'itemKillip3',
          parentId: 'itemKillip',
          title: 'Ⅲ',
          key: '3',
          score: 39
        },
        {
          id: 'itemKillip4',
          parentId: 'itemKillip',
          title: 'Ⅳ',
          key: '4',
          score: 59
        }
      ]
    },
    {
      id: 'itemRisk',
      title: '危险因素',
      value: [],
      key: 'itemRisk',
      controlType: 2, // 1:radio 2:checkbox
      scoreDetails: [
        {
          id: 'itemRisk1',
          parentId: 'itemRisk',
          title: '发病后曾出现心脏骤停',
          key: '1',
          score: 39
        },
        {
          id: 'itemRisk2',
          parentId: 'itemRisk',
          title: '心电图ST段改变',
          key: '2',
          score: 28
        },
        {
          id: 'itemRisk3',
          parentId: 'itemRisk',
          title: '心肌坏死标志物升高',
          key: '3',
          score: 14
        }
      ]
    }
  ]
}
