# Kilogram8

Kilogram8 is the best in class messenger. 

## Development

### Pre-requisites

1. You should know `js`
2. You should have `NodeJS>=12` installed 
3. You should have `npm>=7` installed` 


### Project overview and tech stack

Project is a monorepository with two subprojects:

* Frontend (React + Redux + Mui)
* Backend (Express)

```
├───.github
├───backend
│   └───src
│   └───package.json
├───frontend
│   └───src
│   └───package.json
└─package.json
```

### Workflow

1. Clone the repository or pull from `main`
2. Create new branch.
3. Make feature
4. Ensure code quality!:
   * lint everything: `npm run lint`
   * compile and start ts: `npm run lint`
      
5. Push to repository and make a PR for `main`


### Start app locally

**⚠️ Ensure you have `npm>=7` installed ⚠️**

`npm -v`

You can update npm [here](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)

#### Install and link dependencies:**

Install [typescript](https://www.typescriptlang.org/) and [concurrently](https://github.com/kimmobrunfeldt/concurrently#readme)

`npm install -g concurrently typescript`

#### Install dependencies

`npm install`

#### Link dependencies

`npm link`

#### Launch the app in development mode

`npm run dev`


### Available scripts:

| Command | Description |
| --- | --- |
| `npm run dev` | start whole project in dev mode |
| `npm run build`| build whole project |
| `npm run start` | start whole **pre-built** project |
| `npm run frontend`| start frontend in dev mode|
| `npm run backend` | start backend in dev mode |

#### Running scripts inside workspaces

If you want to run a specific script inside workspace you can use:

`npm run <command> --workspace=<workspace>`

where _workspace_ is either `frontend` or `backend`
where _command_ is a npm script described under <workspace> `package.json`

> Please note, that lint aslo enforces the codestyle


### Start app via Docker (OUTDATED)

Build image

`docker build --rm -t <name> .`

Run container

`docker run -p 8080:8080 -d <name>`

Go to localhost:8080 and get static Hello world page


### FAQ:

#### How to setup linters in webstorm?

**stylelint** — [setup css linter](https://www.jetbrains.com/help/webstorm/using-stylelint-code-quality-tool.html)

**eslint** — [setup ts linter](https://www.jetbrains.com/help/webstorm/eslint.html#ws_js_linters_eslint_install)


## Helpful links:

[A course repository](https://github.com/urfu-2020/slides) (Slides, Homework and Igor Savichev) 
