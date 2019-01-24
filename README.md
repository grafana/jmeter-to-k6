# jmeter-to-k6

Convert JMeter jmx to k6 JS.

## Usage

Install dependencies. Also install [Perl 5][1] if using regular expressions:

```shell
npm install --global csv-parse he perl-regex jsonpath yaml
```

Download `jmeter-to-jmx`:

```shell
git clone https://github.com/loadimpact/jmeter-to-k6.git
cd jmeter-to-k6
```

Convert:

```shell
node bin/jmeter-to-k6.js example/full.xml
```

[1]: https://www.perl.org/get.html

## Other similar tools

- [postman-to-k6](https://github.com/loadimpact/postman-to-k6/): Convert
  Postman to k6 JS.
