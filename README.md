# Authors
### DevOps Team
-   Liam Lindsay - liam.j.lindsay@student.uts.edu.au
-   Tien Long Lam - lamtienlong9@gmail.com (preferred) / lamtienlong@student.uts.edu.au
-   Hussein El-Husseini - hussein.el-husseini@student.uts.edu.au
-   Hamish Mackenzie - hamish.r.mackenzie@student.uts.edu.au
### Previous Team

-   Cattleya Tantri - 11128345@student.uts.edu.au
-   Minh Doan Vu - minhdvu.pro@gmail.com (preferred) / 13066461@student.uts.edu.au
-   Trung The Phan - thetrung2411@gmail.com (preferred) / 13004965@student.uts.edu.au
-   Donny Pereira - 13199587@student.uts.edu.au
-   Justin Brien - 13217702@student.uts.edu.au
-   Kye Manning Lees - 13233681@student.uts.edu.au

# Project Background

WiseTree is created for WiseTech to use as an alternative to the pre-existing `Strategies and Tactics Tree` solution. The project is aimed at creating a robust and scalable web app that would not only replace the later, but lay foundation work for future internal tools for WiseTech as well.

# Development

## Setting Up 

-   Download [NodeJS](https://nodejs.org/en/download/) (This is a runtime for developing and building this project). This will also install npm by default. Confirm by typing `node -v` and `npm -v` in your CLI, the installed version will be printed
-   Install all node-module dependencies by using the `npm install` command project directory

## Available Commands

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Lint your .js & .jsx files for coding errors/bad practices

Rules can be customized via `.eslintrc` file.

### `npm test`

Runs jest to test all custom tests in `test.js` files located under individual folders in the `src/components` folder.

# Publishing to Docker Hub
If Jest tests are completed successfully, the [Publish to DockerHub GitHub Action workflow](/.github/workflows/docker-publish.yml) will run automatically to build a Docker image from the latest version of the repository. The progress of this workflow can be seen by navigating to <strong>Actions > Publish to DockerHub</strong>.
The Docker repository specified in [docker-publish.yml](/.github/workflows/docker-publish.yml) will be the destination to which the resulting Docker image is pushed. You will also need to save the Docker repository's `DOCKERHUB_REPOSITORY`, `DOCKERHUB_TOKEN` and `DOCKERHUB_USERNAME` into GitHub Secrets by navigating to <strong>Settings > Secrets > Actions</strong>.

You can find an image of the latest version of this repository at [Docker Hub](https://hub.docker.com/repository/docker/tienlonglam/wisetree-frontend).

You can pull an image of the latest version of this repository using
````
docker pull tienlonglam/wisetree-frontend
````

# Deployment to Netlify
If Jest tests are completed successfully, the [Netlify GitHub Action workflow](/.github/workflows/netlify.yml) will run automatically to deploy to a Netlify hosting site. The progress of this workflow can be seen by navigating to <strong>Actions > Deploy to Netlify</strong>.
The Netlify site specified in [netlify.yml](/.github/workflows/netlify.yml) will be the destination to which the resulting image is pushed. You will also need to save the Netlify's site ID `NETLIFY_SITE_ID` and authentication token `NETLIFY_TOKEN` into GitHub Secrets by navigating to <strong>Settings > Secrets > Actions</strong>.

You can find live version of this website at [Netlify](https://warm-piroshki-51679d.netlify.app/).

# Testing Details

For testing jest is used for the writing of the tests themselves. This is supported by the use of Enzyme to facilitate shallow rendering of each tested component.

Configuration of jest can be found under `jest.config.js`. You can run each test through the aforementioned `npm test` command. Tests can be found in each component's folder under the `components` directory, under the files `test.js`. 

In order to find out more about each testing utility you can read the relevant documentation at:

Jest: https://jestjs.io/docs/getting-started

Enzyme: https://enzymejs.github.io/enzyme/docs/api/
