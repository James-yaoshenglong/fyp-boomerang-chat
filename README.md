# Boomerang Chat
A browser extension based front-end client for Metadata Private Messager

## Build

### Front-end

```
$ cd front-end
$ npm install
$ npm run build ; change the output path in build.sh
```

### Proxy

```
$ cd proxy
$ docker build -t grpcweb/envoy .
```

### Server

```
$ npm install
```

## Run

### Front-end
1. Load the unpacked browser extension in Chrome
2. Enable the extension and it will automatically start to run

### Proxy

```
$ docker run -d --name grpc-web-proxy -p 8080:8080 grpcweb/envoy
```

### Server

```
node server.js
```