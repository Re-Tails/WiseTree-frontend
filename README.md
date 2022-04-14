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

# Docker Details
If you would like to put a new version into a container, this is listed in the project as Dockerfile. To build this image you can with the command:

docker build --tag wisetreefrontend:XX.XX .

The docker container for this project can be found from:

https://hub.docker.com/r/justox51/wisetreeapi

or pulled into docker from:

docker pull justox51/wisetreeapi

