# Kilogram8

Kilogram8 is the best in class messenger. 

## Development

### Pre-requisites

1. You should have `NodeJS` installed 
2. You should know `js`


### Workflow

1. Clone the repository or pull from `main`
2. Create new branch.
3. Make feature
4. Ensure code quality:
   * lint everything: `yarn lint`
   * compile and start ts: `yarn build`
      
5. Push to repository and make a PR for `main`



### Start app via Docker

Build image

`docker build --rm -t <name> .`

Run container

`docker run -p 8080:8080 -d <name>`

Go to localhost:8080 and get static Hello world page


### Start app locally

Install dependencies:

`npm-install`

Launch the app in development mode

`npm run-script dev`


### Available scripts:

1. Lint CSS: `yarn lint-css`
2. Lint TS: `yarn lint-ts`

> Please note, that lint-ts aslo enforces the codestyle.


### FAQ:

#### How to setup linters in webstorm?

**stylelint** — [setup css linter](https://www.jetbrains.com/help/webstorm/using-stylelint-code-quality-tool.html)

**eslint** — [setup ts linter](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_linters_eslint_install)

##### How deploy static content on surge?

Locally:
1. you should be added to surge project
2. go to /static_content directory
3. run `surge` command in terminal
4. login and watching the magic

For questions about credentials and domain name - welcome to telegram chat.

Heroku: 

Automatic deploy with token and postbuild heroku trigger(see package.json script part).


## Helpful links:

[A course repository](https://github.com/urfu-2020/slides) (Slides, Homework and Igor Savichev) 
