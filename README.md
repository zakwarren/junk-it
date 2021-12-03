# Junk It

"One person's junk is another person's treasure."

An e-commerce app for the exchange of junk, built using a
microservices architecture. The client is a Nextjs React app
and the back end services are all Node Express apps.

It is designed to be deployed using docker images in a kubernetes
cluster. It makes use of github actions for its CI/CD pipeline.

## Start

To run this project, ensure you have docker desktop and skaffold
installed. Then run:

```powershell
skaffold dev
```

## Services

This application is comprised of a number of different services
to explore a variety of different concepts used in a microservices
architecture. These are:

- auth - handles the creation of users and their authentication
- client - provides a useable front end for users to interact with
- expiration - handles the expiration of orders. A user can reserve
  a piece of junk and has a limited time to pay for it before it is
  released for other users to order.
- junk - handles the creation and update of pieces of junk
- orders - handles the reservation and ordering of junk
- payments - handles charging users for junk

All the back end services are built using Node and Express. Most use
MongoDB for their database. The expiration service uses Redis for
its timers. The client was built using Next js.

## Infrastructure

All the services and databases in this app are designed to be deployed
using docker images in a kubernetes cluster. The environment, setup,
and deployment files detailing this can be found in the _infra/k8s_
directory.

## Common

The common directory contains common code in a module that is shared
between all back end services. This approach allows for easy code
reuse, without having to rewrite the implementation in each service.

The _copy-common.bat_ file is a simple script to copy this code
between the services during development.

## Tests

The back end was the focus of this project, so all back end services
have a full suite of tests. This project was developed using a test
driven approach. All services use Jest as the test runner.
