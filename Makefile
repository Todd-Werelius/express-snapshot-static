all: lint

lint:
	./node_modules/.bin/jshint *.js lib

.PHONY: all lint