import test from 'ava'
import parseXml from '@rgrove/parse-xml'
import CSVDataSet from 'element/CSVDataSet'

test('minimal', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CSVDataSet>
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="filename">file.csv</stringProp>
</CSVDataSet>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = CSVDataSet(node)
  t.is(result.imports.get('csvParse'), 'csv-parse/lib/sync')
  t.deepEqual(result.files.get('file.csv'), { path: 'file.csv', binary: true })
  t.is(result.init, `

files["file.csv"] = Buffer.from(files["file.csv"]).toString('utf8')
files["file.csv"] = csvParse(files["file.csv"], {"delimiter":",","quote":null,"columns":true})
csvPage["file.csv"] = 0`)
  t.is(result.prolog, `

{
  // Read CSV line: "file.csv"
  const path = "file.csv"
  const file = files[path]
  if (csvPage[path] !== null) {
    const index = (csvPage[path] * vus) + __VU - 1
    if (index >= file.length) {
      csvPage[path] = null
      const keys = file[0]
      if (keys) for (const key of Object.keys(keys)) vars[key] = '<EOF>'
    } else {
      const record = file[index]
      for (const key of Object.keys(record)) vars[key] = record[key]
      csvPage[path]++
    }
  }
}`)
})

test('rotate', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CSVDataSet>
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="filename">file.csv</stringProp>
  <boolProp name="recycle">true</boolProp>
</CSVDataSet>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = CSVDataSet(node)
  t.is(result.imports.get('csvParse'), 'csv-parse/lib/sync')
  t.deepEqual(result.files.get('file.csv'), { path: 'file.csv', binary: true })
  t.is(result.init, `

files["file.csv"] = Buffer.from(files["file.csv"]).toString('utf8')
files["file.csv"] = csvParse(files["file.csv"], {"delimiter":",","quote":null,"columns":true})
csvPage["file.csv"] = 0`)
  t.is(result.prolog, `

{
  // Read CSV line: "file.csv"
  const path = "file.csv"
  const file = files[path]
  let index = (csvPage[path] * vus) + __VU - 1
  if (index >= file.length) {
    if (!csvPage[path]) throw new Error('Missing CSV data for VU ' + __VU)
    index = __VU - 1
    csvPage[path] = 1
  } else csvPage[path]++
  const record = file[index]
  for (const key of Object.keys(record)) vars[key] = record[key]
}`)
})
