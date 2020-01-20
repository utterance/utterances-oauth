# utterances-oauth

This repo contains the source for the [Cloudflare Worker](https://developers.cloudflare.com/workers/) that powers the GitHub OAuth flow and issue creation for Utterances.

## install

```
yarn install
```

## configuration

Create a file named `.env` at the root. File should have the following values:

- BOT_TOKEN: a personal access token that will be used when creating GitHub issues.
- CLIENT_ID: The client id to be used in the [GitHub OAuth web application flow](https://developer.github.com/v3/oauth/#web-application-flow)
- CLIENT_SECRET: The client secret for the OAuth web application flow
- STATE_PASSWORD: 32 character password for encrypting state in request headers/cookies. Generate [here](https://lastpass.com/generatepassword.php).
- ORIGINS: comma delimited list of permitted origins. For CORS.

Example:

```
BOT_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
CLIENT_ID=aaaaaaaaaaaaaaaaaaaa
CLIENT_SECRET=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
STATE_PASSWORD=01234567890123456789012345678901
ORIGINS=https://utteranc.es,http://localhost:9000
```

## run locally

```
yarn run start
```

## build

```
yarn run build
```

## deploy

First add the necessary CLOUDFLARE\_\* entries to your .env file. See [@cfworker/dev README](https://www.npmjs.com/package/@cfworker/dev) for more information.

Then execute:

```
yarn run deploy
```
