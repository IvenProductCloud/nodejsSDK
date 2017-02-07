<a name="Ivencloud"></a>

## Ivencloud

Nodejs library to connect your devices to Iven Cloud.

## Install
$ npm install ivencloud

## Usage
```javascript
ivencloud.setCredentials(
    {
        deviceUid: "your device uid",
        secretKey: "your secret key"
    });

ivencloud.sendData(data, function(err, res) {
    if (err)
        console.log(err);
    else
        console.log(res);
});
```

## Documentation
* [Ivencloud](#Ivencloud)
    * _instance_
        * [.setCredentials([creds])](#Ivencloud+setCredentials)
        * [.sendData([options], data, callback)](#Ivencloud+sendData)
        * [.activate([options], callback)](#Ivencloud+activate)
        * [.getTasks([options], callback)](#Ivencloud+getTasks)
        * [.taskDone([options], taskCode, callback)](#Ivencloud+taskDone)
    * _inner_
        * [~TasksCallback](#Ivencloud..TasksCallback) : <code>function</code>
        * [~TasksDoneCallback](#Ivencloud..TasksDoneCallback) : <code>function</code>
        * [~callback](#Ivencloud..callback) : <code>function</code>


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
Sends data to the cloud. If the device is not activated it will activates the device.
If the api key expires it will renew the api key

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> |  | The credentials to be set. If you set credentials with activate of setCredentials method you dont need to pass anything |
| [options.apiKey] | <code>string</code> |  | API-KEY of the device |
| [options.deviceUid] | <code>string</code> |  | Device UId of the device |
| [options.secretKey] | <code>string</code> |  | Secret Key of the hardware profile of  the device |
| [options.apiKey] | <code>string</code> |  | API-KEY of the device |
| [options.hostname] | <code>string</code> | <code>&quot;demo.iven.io&quot;</code> | Hostname of the server to be connect |
| data | <code>Object</code> |  | The object which keys must match with HW Profile keys at Iven Cloud |
| callback | <code>[callback](#Ivencloud..callback)</code> |  | Asych. called after sends happen |

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

### ivencloud.getTasks([options], callback)
Gets the tasks assigned to device if any

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | The credentials to be set |
| [options.apiKey] | <code>string</code> | API-KEY of the device |
| callback | <code>[TasksCallback](#Ivencloud..TasksCallback)</code> | Asych. called after |

<a name="Ivencloud+taskDone"></a>

### ivencloud.taskDone([options], taskCode, callback)
Sets the task to completed on Iven Cloud. Call this after you handle the related task
assigned to device

**Kind**: instance method of <code>[Ivencloud](#Ivencloud)</code>

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | The credentials to be set |
| [options.apiKey] | <code>string</code> | API-KEY of the device |
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
| res.apiKey | <code>string</code> | api key of the device |

