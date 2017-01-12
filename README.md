<a name="Ivencloud"></a>

## Ivencloud
**Kind**: global class

* [Ivencloud](#Ivencloud)
    * [new Ivencloud()](#new_Ivencloud_new)
    * _instance_
        * [.setCredentials([creds])](#Ivencloud+setCredentials)
        * [.sendData([options], data, callback)](#Ivencloud+sendData)
        * [.activate([options], callback)](#Ivencloud+activate)
        * [.getTasks(callback)](#Ivencloud+getTasks)
        * [.taskDone(taskCode, callback)](#Ivencloud+taskDone)
    * _inner_
        * [~TasksCallback](#Ivencloud..TasksCallback) : <code>function</code>
        * [~TasksDoneCallback](#Ivencloud..TasksDoneCallback) : <code>function</code>
        * [~callback](#Ivencloud..callback) : <code>function</code>

<a name="new_Ivencloud_new"></a>

### new Ivencloud()
Ivencloud

<a name="Ivencloud+setCredentials"></a>

### ivencloud.setCredentials([creds])
Sets the credentials for authentication.

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [creds] | <code>Object</code> |  | The credentials to be set |
| creds.deviceUid | <code>string</code> |  | Device UId of the device |
| creds.secretKey | <code>string</code> |  | Secret Key of the hardware profile of  the device |
| [creds.apiKey] | <code>string</code> |  | API-KEY of the device |
| [creds.hostname] | <code>string</code> | <code>&quot;demo.iven.io&quot;</code> | Hostname of the server to be connect |

<a name="Ivencloud+sendData"></a>

### ivencloud.sendData([options], data, callback)
Sends data to the cloud

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | The credentials to be set. If you set credentials with activate of setCredentials method you dont need to pass anything |
| [options.apiKey] | <code>string</code> | API-KEY of the device |
| data | <code>Object</code> | The object which keys must match with HW Profile keys at Iven Cloud |
| callback | <code>Ivencloud~sendDataCallback</code> | Asych. called after sends happen |

<a name="Ivencloud+activate"></a>

### ivencloud.activate([options], callback)
Activates the device and sets the api key.

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | The credentials to be set. If you set device credentials you dont have to pass anything to options |
| [options.deviceUid] | <code>string</code> | Device UId of the device |
| [options.secretKey] | <code>string</code> | Secret Key of the hardware profile of the device |
| callback | <code>[callback](#Ivencloud..callback)</code> | Asych. called after activate happens |

<a name="Ivencloud+getTasks"></a>

### ivencloud.getTasks(callback)
Gets the tasks assigned to device if any

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[TasksCallback](#Ivencloud..TasksCallback)</code> | Asych. called after |

<a name="Ivencloud+taskDone"></a>

### ivencloud.taskDone(taskCode, callback)
Sets the task to completed on Iven Cloud. Call this after you handle the related task
assigned to device

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| taskCode | <code>number</code> | Code of the completed task |
| callback | <code>[TasksDoneCallback](#Ivencloud..TasksDoneCallback)</code> | Asych. called after |

<a name="Ivencloud..TasksCallback"></a>

### Ivencloud~TasksCallback : <code>function</code>
Returns the tasks.

**Kind**: inner typedef of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Object</code> &#124; <code>null</code> | return error object in case of error, else null |
| res | <code>Object</code> &#124; <code>undefined</code> | response from the cloud or nothing in case of error |
| res.tasCode | <code>number</code> | task code of the task, zero if no tasks are assigned |
| res.taskValue | <code>string</code> | value of the task, empty if no value |

<a name="Ivencloud..TasksDoneCallback"></a>

### Ivencloud~TasksDoneCallback : <code>function</code>
Returns the tasks.

**Kind**: inner typedef of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Object</code> &#124; <code>null</code> | return error object in case of error, else null. |
| res | <code>Object</code> &#124; <code>undefined</code> | response from the cloud or nothing in case of error. |
| res.status | <code>number</code> | 200 if successful* |

<a name="Ivencloud..callback"></a>

### Ivencloud~callback : <code>function</code>
Callback after an request is made to cloud.

**Kind**: inner typedef of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Object</code> &#124; <code>null</code> | return error object in case of error, else null. |
| res | <code>Object</code> &#124; <code>undefined</code> | response from the cloud or nothing in case of error. |
| res.ivenCode | <code>number</code> | iven code |
| res.api_key | <code>string</code> | api key of the device |

