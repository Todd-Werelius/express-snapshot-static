all: lint test

lint:
	./node_modules/.bin/jshint *.js lib

test:
	./node_modules/.bin/jshint *.js lib

.PHONY: all lint