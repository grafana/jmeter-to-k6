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
  t.is(result.imports.get('papaparse'), 'papaparse')
  t.deepEqual(result.files.get('"file.csv"'), { binary: true })
  t.is(result.init, `

files["file.csv"] = buffer.Buffer.from([ ...files["file.csv"] ])
files["file.csv"] = iconv.decode(files["file.csv"], 'utf8')
files["file.csv"] = papaparse.parse(files["file.csv"], {"delimiter":",","header":true}).data
csvPage["file.csv"] = 0`)
  t.is(result.prolog, `

{
  /*
   * Read CSV line: "file.csv"
   * NOTE: In JMeter all Virtual Users (aka Threads) can read from the same
   * CSVDataSet. In k6 there's no data sharing between VUs. Instead you can
   * use the __VU global variable to help partition the data (if running in
   * the Load Impact cloud you'll also have to use LI_INSTANCE_ID).
   */
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
      for (const name of Object.keys(record)) vars[name] = record[name]
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
  t.is(result.imports.get('papaparse'), 'papaparse')
  t.deepEqual(result.files.get('"file.csv"'), { binary: true })
  t.is(result.init, `

files["file.csv"] = buffer.Buffer.from([ ...files["file.csv"] ])
files["file.csv"] = iconv.decode(files["file.csv"], 'utf8')
files["file.csv"] = papaparse.parse(files["file.csv"], {"delimiter":",","header":true}).data
csvPage["file.csv"] = 0`)
  t.is(result.prolog, `

{
  /*
   * Read CSV line: "file.csv"
   * NOTE: In JMeter all Virtual Users (aka Threads) can read from the same
   * CSVDataSet. In k6 there's no data sharing between VUs. Instead you can
   * use the __VU global variable to help partition the data (if running in
   * the Load Impact cloud you'll also have to use LI_INSTANCE_ID).
   */
  const path = "file.csv"
  const file = files[path]
  let index = (csvPage[path] * vus) + __VU - 1
  if (index >= file.length) {
    if (!csvPage[path]) throw new Error('Missing CSV data for VU ' + __VU)
    index = __VU - 1
    csvPage[path] = 1
  } else csvPage[path]++
  const record = file[index]
  for (const name of Object.keys(record)) vars[name] = record[name]
}`)
})

test('custom names', t => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CSVDataSet>
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="filename">file.csv</stringProp>
  <stringProp name="variableNames">first,second,"thi,rd"</stringProp>
</CSVDataSet>
`
  const tree = parseXml(xml)
  const node = tree.children[0]
  const result = CSVDataSet(node)
  t.is(result.imports.get('papaparse'), 'papaparse')
  t.deepEqual(result.files.get('"file.csv"'), { binary: true })
  t.is(result.init, `

files["file.csv"] = buffer.Buffer.from([ ...files["file.csv"] ])
files["file.csv"] = iconv.decode(files["file.csv"], 'utf8')
files["file.csv"] = papaparse.parse(files["file.csv"], {"delimiter":","}).data
csvPage["file.csv"] = 0
csvColumns["file.csv"] = {"first":0,"second":1,"thi,rd":2}`)
  t.is(result.prolog, `

{
  /*
   * Read CSV line: "file.csv"
   * NOTE: In JMeter all Virtual Users (aka Threads) can read from the same
   * CSVDataSet. In k6 there's no data sharing between VUs. Instead you can
   * use the __VU global variable to help partition the data (if running in
   * the Load Impact cloud you'll also have to use LI_INSTANCE_ID).
   */
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
      for (const name of Object.keys(csvColumns[path])) {
        const index = csvColumns[path][name]
        vars[name] = record[index]
      }
      csvPage[path]++
    }
  }
}`)
})
