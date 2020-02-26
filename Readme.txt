$ npm install
$ npm run css-prod
$ npm run webpack-prod

POT bijwerken

$ docker-compose run --user 33 -e HOME=/tmp --rm wpcli i18n make-pot ./wp-content/plugins/gh-datainmap ./wp-content/plugins/gh-datainmap/languages/gh-datainmap.pot --domain=gh-datainmap --skip-js

Nieuwe plugin ZIP maken (enkel vanuit master)

$ npm run create-release-archive