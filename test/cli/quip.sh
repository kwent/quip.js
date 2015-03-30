#!/bin/bash

# Colors
red () {
  echo "\033[31m"$@
}

green () {
  echo "\033[01;32m"$@
}

# Variables
TOKEN=''

# Helpers
valid () {
  eval $@ > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    [ -z "$TRAVIS" ] && green "SUCCESS" || echo "SUCCESS"
    return 0
  else
    [ -z "$TRAVIS" ] && red "FAILED" || echo "FAILED"
    return 1
  fi
}

# Tests
# Syntax: valid cmd [options] Exit code 0 (Success) expected.
# Syntax: valid ! cmd [options] Exit code 1 (Failure) expected.
echo "Begin Tests CLI :" `date`

valid "node bin/quip.js -t $TOKEN -h" &&
valid "node bin/quip.js -t $TOKEN -V" &&
valid "! node bin/quip.js th -c wrong_path" &&
valid "touch config_file.yaml && ! node bin/quip.js th -c config_file.yaml && rm config_file.yaml" &&
valid "! node bin/quip.js wrong_command getFileStationInfo -t $TOKEN -d" &&
valid "! node bin/quip.js th wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js msg wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js fdr wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js usr wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js threads wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js messages wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js folders wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js users wrong_method -t $TOKEN -d" &&
valid "! node bin/quip.js wrong_command -t $TOKEN -d"

echo "End Tests CLI :" `date`