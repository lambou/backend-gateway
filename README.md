# Backend Gateway
Front-end helper to communicate with APIs, based on [Axios]([github.com/axios/axios](https://github.com/axios/axios))

### Installation

Npm

```powershell
npm install backend-gateway
```

Yarn

```powershell
yarn install backend-gateway
```



### Initialize the gateway

To start a communication with the API we need to define the `base url`. 

```typescript
import { Backend } from "backend-gateway";

// somewhere in the code
Backend.init({
    config: {
      baseURL: `https://api.mylovelyapp.dev`,
    },
});
```

`init` function properties:

| Property              | Type                                                | Description                                                  |
| --------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| config                | AxiosRequestConfig - *exported by axios*            | global configuration of axios instance                       |
| errorMessageExtractor | (error?: T) => string \| Array<string> \| undefined | The logic to extract the error message from the error response. By default we will look at the **message** property in the error response body |



### Access Token

In almost all APIs, some functionality is protected and requires an `access token` to consume it. Anywhere in the code you can use the following method to globally modify the HTTP request headers.

```typescript
import { Backend } from "backend-gateway";

// update the authorization header and all future requests will be automatically signed
Backend.updateHeaders({
    Authorization: `Bearer ${access_token}`,
});

// clear authorization header
Backend.updateHeaders({
    Authorization: undefined,
});
```

> You can call `updateHeaders` all around the app.



### Make a request

> The Backend class implements the **singleton pattern**. To get an instance and make a request use its static method `getInstance`.

Here is an example or request:

```typescript
import { Backend } from "backend-gateway";

Backend.getInstance().call({
    config: {
        method: "get",
        url: "/user", // the Base url has already been configured
    },
    beforeStart: () => {
		// before start logic
        // example: start loading
    },
    successCallback: (response) => {
        // your success login
        // const user = response.data;
    },
    errorCallback: (error, errorMessage) => {
        // errorMessage: the value returned by errorMessageExtractor if set or the default `message` property of the response
        // your error logic
        // const errorData = error.response?.data;
        // const cancelled = Axios.isCancel(error);
    },
    finishCallback: () => {
		// on finish logic
        // example: stop loading
    },
});
```



Notes:

- call is and **asynchronous** function.
- call is a `generic function`, you can provide the type of the success response data and the type of the type of the error response data
  - `Backend.getInstance().call<User[]>({})`
  - `Backend.getInstance().call<ProjectDetails, Error>({})`



## License



MIT © [lambou](https://github.com/lambou)