.PHONY: build test run

build:
	env GOOS=linux GOARCH=386 go build -o ./bin/backend-linux
	env GOOS=windows GOARCH=386 go build -o ./bin/backend-windows.exe
	env GOOS=darwin GOARCH=386 go build -o ./bin/backend-macos

test:
	go vet
	go test -count=1 -race ./tests/

run:
	go run .