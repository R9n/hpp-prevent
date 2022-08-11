## HPP-PREVENT

![buils](https://img.shields.io/appveyor/build/R9n/hpp-prevent)
[![codecov](https://codecov.io/gh/R9n/hpp-prevent/branch/main/graph/badge.svg?token=6I00XDYH40)](https://codecov.io/gh/R9n/hpp-prevent)

### Express middleware for prevent **_http parameter pollution_**

hpp-prevent is a middleware for express to prevent hpp (http param pollution) attack

#### What is, and how works, a hpp attack ?

hpp is a type of attack where an external attacker adds parameters with the same name to a given endpoint. This, depending on the platform used, can generate unexpected behavior of the systems. Is the case of **_Express_**, more than one parameter with the same name will be added in an array.
Or worse, this can override some valid parameters.

#### And how **_hpp-prevent_** solve this problem ?

**_hpp-prevent_** lets you configure the behavior of Express, you can choose to take the last or the first occurrence of some parameter when some parameter is passed more than one time. This is important because, sometimes you have to match the order of Express and other firewall systems, if this order of validation mismatch, your validation will be bypassed.

#### How to use

To use hpp-prevent is pretty easy.

#### First import the library

`const hppPrevent = require('hpp-prevent')`

#### Second, configure the library.

To do so, you need to call the **_config_** method, that function accept these parameters:

-   **_takeLastOcurrences_**: Boolean that indicates what is the element that will be picked when more than one parameter with the same name is found, true indicates that the last element will be picked, false indicates that the first element will be picked. For default is **_true_**

-   **_blacklist_**: This is a list of terms that you want to explicitly block in your query parameters, once a term is put in this list, the parameter and value will be stripped off from parameters if a key or a value match the term in the blacklist. By default, this list comes filled with **\_**proto**\_** and **_constructor_** words that are usually used to perform prototype pollution attacks.

-   **_whitelist_**: For some reason you may want to have some parameter having multiple values, in this case you can put the parameters that you expect to have more than one value in this list. By default, is an empty list
-   **_returnBadRequestReponse_**: This variable controls if a bad request response should be returned if any of the parameters of the query object match to a term in the blacklist. If this variable is set to **_true_** and any term is found in blacklist then a bad Request response with status 400 will be returned, otherwise, if any of the parameters is found in black list and this variable is **_false_** then that parameter will be stripped off from the query object and no response will be returned, the processes of the request will continue as normal. By default, is set to **_false_**

-   **_customInvalidParamMessage_**: This is a string that will be returned in case of
    **_returnBadRequestReponse_** variable is set to true and any of the terms in query object is found in blacklist

```
const hppPrevent = require('hpp-prevent');

hppPrevent.config({
  takeLastOcurrences: false,//this tell to take the first occurrence of any duplicated param
  blackList: ['select'],
  returnBadRequestReponse: true,
  customInvalidParamMessage: 'Invalid param, please remove it',
})
```

#### Third, set the express app to use the middleware

`app.use(hppPrevent.hppPrevent)`

That 's all !!

Hope this package help you to make your api more secure 😀😀

#### License

![buils](https://img.shields.io/bower/l/mi)

#### About the author

Dev, System Analyst, Gamer :D

**_LinkedIn_**: www.linkedin.com/in/ronaldo-mp

**_Github_**: https://github.com/R9n
