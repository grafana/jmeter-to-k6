Translation behavior for each element.

## {shared}

Attributes shared by multiple elements. Specifies default actions.

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| guiclass | ? | Ignore. |
| testclass | ? | Ignore. |
| testname | Human name. | Ignore. |
| enabled | Boolean. | Skip if `false`. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Ignore. |

## {variable}

An `elementProp` node representing a variable.

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| name | Name. | Ignore. Name property used instead. |
| elementType | Seemingly always `Argument`. | Ignore. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| name | string | Name. | Encode to valid string. Render as name. |
| value | string | Value. | Encode to valid string. Render as value. |
| desc | string | Human description. Single line. | Render as comment. |
| metadata | string | Seemingly always `=`. | Ignore. |

## {variables}

A `collectionProp` node representing a set of variables.

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| name | Seemingly always `Arguments.arguments`. | Ignore. |

**Child**

| Element | Description | Action |
| ------- | ----------- | ------ |
| elementProp | A variable. | Render as variable. |

## CookieManager

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| cookies | collection | A priori cookies. | Add to initial cookie jar. |
| clearEachIteration | bool | ?  | Ignore. |
| policy | string | ? | Ignore. |

## DNSCacheManager

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| servers | collection | ? | Ignore. |
| clearEachIteration | bool | ? | Ignore. |
| isCustomResolver | bool | ? | Ignore. |
| hosts | collection | Static host table. | Option `hosts`. |

## DurationAssertion

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| testname | Human name. | Check text. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments | Check text. |
| duration | string | Max duration in ms. | Max `res.timings.duration`. |

## hashTree

No attributes or properties.

## IfController

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Comment. |
| condition | string | Condition formula. | Render to JavaScript. |
| evaluateAll | bool | Check for each child. | ? |
| useExpression | bool | Condition single expression. | ? |

## jmeterTestPlan

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | Version string. | Ignore. |
| properties | Version string. | Ignore. |
| jmeter | Version string. | Ignore. |

## JSONPathAssertion

* Regular expression test requires Perl 5.

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| testname | Human name. | Check text. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Check text. |
| JSON_PATH | string | JSONPath code. | Path specification. |
| EXPECTED_VALUE | string | Test string. | Value specification. |
| JSONVALIDATION | bool | Seemingly unused. | Ignore. |
| EXPECT_NULL | bool | Test for null. | Enable test for null. |
| INVERT | bool | Negate test. | Enable result negation. |
| ISREGEX | bool | Use test string as regex. | Enable regex testing. |
| INPUT_FORMAT | string | Input format: `JSON` `YAML` | Input interpretation. |

## PostThreadGroup

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Comment in teardown logic. |
| on_sample_error | string | ? | ? |
| main_controller | element | ? | ? |
| num_threads | string | Thread count. | ? |
| ramp_time | string | Ramp time to thread count. | ? |
| scheduler | bool | ? | ? |
| duration | string | ? | ? |
| delay | string | ? | ? |
| delayedStart | bool | ? | ? |

## ResponseAssertion

* Regular expression features require Perl 5.
* Operand `response_data_as_document` not supported. Uses external
  software Apache Tika.
* Operand  `response_message` not supported. Not exposed by k6.

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| testname | Human name. | Check text. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Check text. |
| test_strings | collection | Test patterns. | 1 check per line. |
| custom_message | string | Failure message. | Ignore. |
| test_field | string | Operand. | Field in check. |
| assume_success | bool | Force initialize status to success. | Ignore. |
| test_type | int | Operation. | Operators in check. |

## SetupThreadGroup

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Comment in setup logic. |
| on_sample_error | string | ? | ? |
| main_controller | element | ? | ? |
| num_threads | string | Thread count. | ? |
| ramp_time | string | Ramp time to thread count. | ? |
| scheduler | bool | ? | ? |
| duration | string | ? | ? |
| delay | string | ? | ? |
| delayedStart | bool | ? | ? |

## SteppingThreadGroup

* Translates to `stages` option with ramp ups for each group. Default
  `SteppingThreadGroup` behavior seems to have all threads in a group starting
  at once, so this is an approximation.
* Stepped thread stopping not translated. No obvious counterpart in k6.

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Comment in prolog. |
| on_sample_error | string | ? | ? |
| num_threads | string | Ultimate thread count. | Calculate step count. |
| Threads initial delay | string | ? | ? |
| Start users count | string | Step thread count. | Option `stages`, VU count. |
| Start users period | string | Step interval. | Option `stages`, duration. |
| Stop users count | string | End step thread count. | ? |
| Stop users period | string | End step interval. | ? |
| flighttime | string | ? | ? |
| main_controller | element | ? | ? |
| rampUp | string | ? | ? |

## TestPlan

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| testname | Human name for test. | Comment. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Contents freeform comments. | Comment in init logic. |
| functional_mode | bool | Enable data saving. | ? |
| tearDown_on_shutdown | bool | Run teardown after shutdown. | ? |
| serialize_threadgroups | bool | Serialize thread groups. | ? |
| user_defined_variables | element | Defines variables. | Variables. |
| user_define_classpath | string | ? | Ignore. |

## ThreadGroup

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Freeform comments. | Comment in VU logic. |
| on_sample_error | string | ? | ? |
| main_controller | element | ? | ? |
| num_threads | string | Thread count. | Option `stages`, VU count. |
| ramp_time | string | Ramp time to thread count. | Option `stages`, duration. |
| scheduler | bool | ? | ? |
| duration | string | ? | ? |
| delay | string | ? | ? |
| delayedStart | bool | ? | ? |

## xml

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | XML version string. | Ignore. |
| encoding | Character encoding. | Ignore. |

## XPathAssertion

No equivalent feature. Translate to explanatory comment suggesting 3rd party
software.
