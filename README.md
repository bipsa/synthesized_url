# Synthesized URL
This test shorts a given URL. It provides a command-line interface to interact with the API. The project does not include an external database to avoid dependencies and allowing to port quickly to AWS. See production deployment. 

## How to run the project
The solution includes all different projects on a single repository.

### Server
The server application uses NodeJS. As any other Node project, install dependencies first `npm install`. The available script are the following;
`npm run dev` Runs the server to expose the API.
`npm run test` Executes the available tests.
`npm run fix` It just executes standard js to keep the code uniform.

#### Available endpoints
The following endpoints are exposed:

##### Short url
Short the given URL. This is a post a request. It takes the following process:
1. The method breaks the given URL into parts domain and  URL. The objective is to increase the number of URLs that the system can store.
2. The shorten method creates a file to identify domains, URLs, also for status and stats.
3. If the URL has created already, it returns the path.

```shell
curl --location --request POST 'http://localhost:3000/shorten/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "url": "https://github.com/SBoudrias/Inquirer.js#readme"
}'
```