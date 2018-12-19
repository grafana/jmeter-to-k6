Translation behavior for each element.

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

## hashTree

No attributes or properties.

## jmeterTestPlan

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | Version string. | Ignore. |
| properties | Version string. | Ignore. |
| jmeter | Version string. | Ignore. |

## TestPlan

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| guiclass | ? | Ignore. |
| testclass | ? | Ignore. |
| testname | Plaintext name for test. | Comment. |
| enabled | Boolean. | Ignore. |

**Property**

| Name | Type | Description | Action |
| ---- | ---- | ----------- | ------ |
| comments | string | Contents freeform comments. | Comment. |
| functional_mode | bool | Enable data saving. | ? |
| tearDown_on_shutdown | bool | Run teardown after shutdown. | ? |
| serialize_threadgroups | bool | Serialize thread groups. | ? |
| user_defined_variables | element | Defines variables. | Variables. |
| user_define_classpath | string | ? | Ignore. |

## xml

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | XML version string. | Ignore. |
| encoding | Character encoding. | Ignore. |
