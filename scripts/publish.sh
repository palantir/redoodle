#!/bin/bash

set -ex
set -o pipefail

if [ -z ${CIRCLECI+x} ]; then
    echo "Not on Circle; refusing to run."
    exit 1
fi

# Defend against yarn adding enviroment variables for config  https://github.com/yarnpkg/yarn/issues/4475
unset $(env | awk -F= '$1 ~ /^npm_/ {print $1}')

# Generate npmrc, ensure it is readable
set +x
echo "//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}" > .npmrc
set -x
chmod +r .npmrc

# Change package version to latest tag
npm version "$CIRCLE_TAG" --no-git-tag-version

# Package and publish
npm publish --access public
