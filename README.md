## ⚠️ This project is no longer maintained. 

> Development and maintenance of the JMeter-to-k6 converter  have been stopped in this repository.


If you are a JMeter user starting with k6, check out how [k6 compares to JMeter](https://k6.io/blog/k6-vs-jmeter/) and learn how to use k6 on the [documentation](https://k6.io/docs/). 

-------------------------------------------------------------

**Install**:

Globally, and preferably using [nvm](https://github.com/creationix/nvm) (at least on Unix/Linux systems to avoid filesystem permission issues when using sudo):

```shell
npm install -g jmeter-to-k6
```

Locally, into `./node_modules`:

```shell
npm install jmeter-to-k6
```

Note that this will require you to run the converter with `node node_modules/jmeter-to-k6/bin/jmeter-to-k6.js ...`.

Alternatively, you can install the tool from DockerHub:

```shell
docker pull grafana/jmeter-to-k6
```

**Convert**:

Convert [JMeter](https://jmeter.apache.org/) JMX to [k6](https://k6.io/) JS.

```shell
jmeter-to-k6 example/full.jmx -o full
```

This will create a directory `./full/` with a file called `test.js` and a sub-directory called `libs`.

One-off execution using [npx](https://www.npmjs.com/package/npx) (avoiding the installation of the tool on your system):

```shell
npx jmeter-to-k6 example/full.jmx -o full
```

Using the Docker image, you execute the tool as follows:

```shell
docker run -it -v "/path/to/jmeter-files/:/output/" grafana/jmeter-to-k6 /output/MyTest.jmx -o /output/MyTestOutput/
```

and then execute the k6 test using:

```shell
k6 run /path/to/jmeter-files/MyTestOutput/test.js
```

**Run test in k6**:

```shell
k6 run full/test.js
```

