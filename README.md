# Synthesized URL
This test shorts a given URL. It provides a command-line interface to interact with the API. The project does not include an external database to avoid dependencies and allowing to port quickly to AWS. See production deployment. 

## How to run the project
The solution includes all different projects on a single repository.

### Server
The server application uses NodeJS. As any other Node project, install dependencies first `npm install`. The available script are the following;
1. `npm run dev` Runs the server to expose the API.
2. `npm run test` Executes the available tests.
3. `npm run fix` It just executes standard js to keep the code uniform.

#### Available endpoints
The following endpoints are exposed:

##### Short URL
Short the given URL. This is a post a request. It takes the following process:
1. The method breaks the given URL into parts domain and  URL. The objective is to increase the number of URLs that the system can store.
2. The shorten method creates a file to identify domains, URLs, also for status and stats.
3. If the URL has created already, it returns the path.

```shell
curl --location --request POST 'http://localhost:3000/shorten/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "https://github.com/bipsa/synthesized_url"
}'
```
###### Response
```js
{
  "url": "http://localhost:3000/oOJ/q7x/"
}
```

##### View URL
This endpoint redirects the user to the hidden URL
```shell
curl --location --request GET 'http://localhost:3000/oOJ/q7x/'
```
###### Response if the URL has been disabled
The http code sent is 400
```js
{
  "message": "URL is not available."
}
```

##### Disable URL
This endpoint disable an url
```shell
curl --location --request GET 'http://localhost:3000/oOJ/q7x/disable/'
```
###### Response
```js
{
  "response": false
}
```

##### Enable URL
This endpoint enable an url
```shell
curl --location --request GET 'http://localhost:3000/oOJ/q7x/enable/'
```
###### Response
```js
{
  "response": true
}
```

##### Stats URL
This endpoint shows the stats for the given url
```shell
curl --location --request GET 'http://localhost:3000/oOJ/q7x/stats/'
```
###### Response
The http code sent is 400
```js
{
  "total": 2,
  "visits": [
    {
      "ip": "::1",
      "date": "2020-05-17T03:23:22.319Z"
    },
    {
      "ip": "::1",
      "date": "2020-05-17T03:23:53.926Z"
    }
  ]
}
```