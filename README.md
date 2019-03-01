# jmeter-to-k6

Convert [JMeter](https://jmeter.apache.org/) JMX to [k6](https://k6.io/) JS.

## Usage

**Install**:

Globally, and preferably using [nvm](https://github.com/creationix/nvm) (at least on Unix/Linux systems to avoid permission issues):
```shell
npm install -g jmeter-to-k6
```

Locally, into `./node_modules`:
```shell
npm install jmeter-to-k6
```

Note that this will require you to run the converter with `node node_modules/jmeter-to-k6/bin/jmeter-to-k6.js ...`.

**Convert**:

```shell
jmeter-to-k6 example/full.jmx -o full
```

This will create a directory `./full/` with a file called `test.js` and a sub-directory called `libs`.

One-off execution using [npx](https://www.npmjs.com/package/npx) (avoiding the installation of the tool on your system):
```shell
npx jmeter-to-k6 example/full.jmx -o full
```

**Run test in k6**:

```shell
k6 run full/test.js
```

## Other similar tools

- [postman-to-k6](https://github.com/loadimpact/postman-to-k6/): Convert
  Postman to k6 JS.
