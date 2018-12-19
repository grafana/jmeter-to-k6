Translation behavior for each element.

## xml

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | XML version string. | Ignore. |
| encoding | Character encoding. | Ignore. |

## jmeterTestPlan

**Attribute**

| Name | Description | Action |
| ---- | ----------- | ------ |
| version | Version string. | Ignore. |
| properties | Version string. | Ignore. |
| jmeter | Version string. | Ignore. |

## hashTree

No attributes or properties.

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
