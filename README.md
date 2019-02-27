# jmeter-to-k6

Convert [JMeter](https://jmeter.apache.org/) JMX to [k6](https://k6.io/) JS.

## Usage

**Install**:

```shell
npm install -g jmeter-to-k6
```

Note that this will install the tool globally, skip the `-g` if you only want to install it to `./node_modules`.

**Convert**:

```shell
jmeter-to-k6 example/full.jmx -o full
```

This will create a directory `./full/` with a file called `test.js` and a sub-directory called `libs`.

**Run test in k6**:

```shell
k6 run full/test.js
```

## Other similar tools

- [postman-to-k6](https://github.com/loadimpact/postman-to-k6/): Convert
  Postman to k6 JS.
