# utterances-oauth

## install

```
npm install
```

## configuring for debugging

1. Create a file named `.env` at the root. File should have the following values:

    * PORT: the port the http server will listen on
    * BOT_TOKEN: a personal access token that will be used when creating GitHub issues.
    * CLIENT_ID: The client id to be used in the [GitHub OAuth web application flow](https://developer.github.com/v3/oauth/#web-application-flow)
    * CLIENT_SECRET: The client secret for the OAuth web application flow
    * STATE_PASSWORD: 32 character password for encrypting state in request headers/cookies. Generate [here](https://lastpass.com/generatepassword.php).
    * SCOPES: The OAuth scopes the service is permitted to grant. "public_repo"
    * ORIGINS: comma delimited list of permitted origins. For CORS.
    * APP_ROOT: The root url of the deployed application. eg https://utterances-oauth.azurewebsites.net
    * USER_AGENT: The GitHub API [requires a User-Agent](https://developer.github.com/v3/#user-agent-required) header.


    Example:

    ```
    PORT=5000
    BOT_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    CLIENT_ID=aaaaaaaaaaaaaaaaaaaa
    CLIENT_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    STATE_PASSWORD=01234567890123456789012345678901
    SCOPES=public_repo
    ORIGINS=https://utteranc.es,http://localhost:9000
    APP_ROOT=http://localhost:5000
    USER_AGENT=utterances
    ```

2. Execute `npm run develop` to watch the TypeScript files and automatically build them.

3. Execute `npm run start-env` to set the environment variables using your `.env` and execute `index.js`.
