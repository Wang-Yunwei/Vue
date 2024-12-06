import ExcelJS from 'exceljs'

/**
 * 返回图表的 dataURL 用于生成图片。
 * @param chart 需要获取 DataURL 的 chart 实例
 * @returns 返回图表的 dataURL,图片的宽高
 */
function toBase64Img(chart) {
  const canvas = chart.getCanvas()
  const renderer = chart.renderer
  const canvasDom = canvas.get('el')
  let dataURL = ''
  if (renderer === 'svg') {
    const clone = canvasDom.cloneNode(true)
    const svgDocType = document.implementation.createDocumentType(
      'svg',
      '-//W3C//DTD SVG 1.1//EN',
      'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'
    )
    const svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType)
    svgDoc.replaceChild(clone, svgDoc.documentElement)
    const svgData = new XMLSerializer().serializeToString(svgDoc)
    dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData)
  } else if (renderer === 'canvas') {
    dataURL = canvasDom.toDataURL('image/png')
  }
  return { dataURL, width: canvasDom.width, height: canvasDom.height }
}

export const exportAsExcel = async ({ fileName = '导出文件.xlsx', sheets = [] }) => {
  const workbook = new ExcelJS.Workbook()
  let paramErr = false
  sheets.forEach(async (sheet, index) => {
    const { sheetName = `Sheet${index + 1}`, title = '', subtitle = '', columns = [], dataSource = [], chart } = sheet

    // 常见错误屏蔽
    if (!Array.isArray(dataSource)) {
      console.error('类型错误:dataSource必须为数组!')
      paramErr = true
      return
    }

    // 添加一个sheet
    const worksheet = workbook.addWorksheet(sheetName)
    const colsGroup = [] // 除去底部单元格的表头分组,二维数组
    const bottomCols = [] // 表头最底部单元格
    const loopCols = (arr, curLevel = 0) => {
      // 递归生成 colsGroup 和 bottomCols
      arr.forEach(col => {
        if (col.children?.length) {
          const newGroup = {
            title: col.title,
            startIndex: bottomCols.length
          }
          if (colsGroup[curLevel]) {
            colsGroup[curLevel].push(newGroup)
          } else {
            colsGroup[curLevel] = [newGroup]
          }
          loopCols(col.children, curLevel + 1, newGroup)
          newGroup.endIndex = bottomCols.length - 1
          bottomCols.slice(newGroup.startIndex, newGroup.endIndex + 1).forEach(item => (item.levels = item.levels + 1))
        } else {
          bottomCols.push({ ...col, levels: 0 })
        }
      })
    }
    loopCols(columns)

    // 写入表格列
    worksheet.columns = bottomCols.map(col => {
      return {
        header: col.title,
        key: col.dataIndex,
        width: col.width || 10,
        style: {
          font: {
            name: '黑体'
          },
          alignment: {
            vertical: 'middle',
            horizontal: 'center'
          }
        }
      }
    })

    // 写入表格数据
    const rows = [...dataSource]
    const newRows = worksheet.addRows(rows)

    // 表格的插入起始行号
    let tableStartIndex = 1
    // 图表的插入起始行号
    let chartInsertRowIndex = rows.length + 3 + colsGroup.length

    // 主标题
    if (title) {
      worksheet.insertRow(tableStartIndex, [title])
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columns.length)}1`)
      chartInsertRowIndex += 1
      tableStartIndex += 1
    }

    // 副标题
    if (subtitle) {
      worksheet.insertRow(tableStartIndex, [subtitle])
      worksheet.mergeCells(`A${tableStartIndex}:${String.fromCharCode(64 + columns.length)}${tableStartIndex}`)
      chartInsertRowIndex += 1
      tableStartIndex += 1
    }

    // 表头分组合并
    if (colsGroup.length) {
      colsGroup.forEach((gArr, lvl) => {
        const obj = {
          length: bottomCols.length
        }
        gArr.forEach(g => (obj[g.startIndex] = g.title))
        const gTitles = Array.from(obj, (title, index) => {
          return title ?? bottomCols[index].title
        })
        worksheet.insertRow(lvl + tableStartIndex, gTitles)
        gArr.forEach(g => {
          // 横向合并
          worksheet.mergeCells(lvl + tableStartIndex, g.startIndex + 1, lvl + tableStartIndex, g.endIndex + 1)
        })
      })
      bottomCols.forEach((col, idx) => {
        if (col.levels < colsGroup.length) {
          // 纵向合并
          worksheet.mergeCells(col.levels + tableStartIndex, idx + 1, colsGroup.length + tableStartIndex, idx + 1)
        }
      })
    }

    // 插入图表
    if (chart) {
      const img = toBase64Img(chart)
      const imageId = workbook.addImage({ base64: img.dataURL, extension: 'png' })
      worksheet.addImage(imageId, {
        tl: { col: 0, row: chartInsertRowIndex },
        ext: { width: img.width, height: img.height }
      })
    }
  })

  if (!paramErr) {
    // 开始导出
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    const link = document.createElement('a')
    link.addEventListener('click', () => {
      link.download = fileName
      link.href = window.URL.createObjectURL(blob)
    })
    const e = document.createEvent('MouseEvents')
    e.initEvent('click', false, false)
    link.dispatchEvent(e)
  }
}
