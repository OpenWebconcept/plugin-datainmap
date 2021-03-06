# Data In Map

[![Build](https://github.com/OpenWebconcept/plugin-datainmap/actions/workflows/build.yml/badge.svg?branch=develop)](https://github.com/OpenWebconcept/plugin-datainmap/actions/workflows/build.yml)

Data In Map is a WordPress plugin for displaying maps.

## Changelog

A (Dutch) changelog is being kept at `CHANGELOG.MD`

## Install
### For developers

#### Building

````
$ npm install
$ npm run css-prod
$ npm run webpack-prod
$ npm run composer
````

Then, install in a WordPress environment or for local development use the provided `docker-compose.yml` file and run `$ docker-compose up` from the main directory.

#### Updating POT

Using the provided `docker-compose.yml` file run:

`$ docker-compose run --user 33 -e HOME=/tmp --rm wpcli i18n make-pot ./wp-content/plugins/gh-datainmap ./wp-content/plugins/gh-datainmap/languages/gh-datainmap.pot --domain=gh-datainmap --skip-js`

#### Creating a new release

Before tagging a new release make sure the version number is being updated in the following files:

- `package.json`
- `gh-datainmap.php`
- `CHANGELOG.md`

A GitHub Action workflow called Release is being run for every new tag and packages up the distribution file.

### For production
Download a pre-packaged GitHub release. After installation you can follow the configuration steps in the provided documentation (locate it in your WordPress admin menu).