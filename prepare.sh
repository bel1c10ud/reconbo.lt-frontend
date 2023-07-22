#!/bin/sh

git remote remove origin || echo 'Origin remote has already been removed.'
git remote add live https://github.com/bel1c10ud/reconbo.lt-frontend.git || echo 'Live remote has already been added.'