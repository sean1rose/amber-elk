[![Stories in Ready](https://badge.waffle.io/amber-elk/amber-elk.png?label=ready&title=Ready)](https://waffle.io/amber-elk/amber-elk)
[![Build Status](https://travis-ci.org/Amber-Elk/amber-elk.svg?branch=master)](https://travis-ci.org/Amber-Elk/amber-elk)
# Amber-Elk: Into the Deep

> A 3D Game

## Team

  - __Product Owner__: Rishi Goomar
  - __Scrum Master__: Sean Rose
  - __Development Team Members__: Liam Schauerman, Tom G Varik

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Coming Soon!

## Requirements

- Node 0.10.x
- Gulp
- Bower
- NPM

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g bower (or sudo npm install -g bower)
npm install -g gulp (or sudo npm install -g gulp)
npm install
bower install
```

### Gulp Commands
#### Starting Development Server
```sh
# Run JSHint, Mocha Tests, then start the server
gulp
```

#### Generating Documentation
```sh
# Generates documentation under "/docs"
gulp docs
```

#### Running Tests and Generating Code Coverage
```sh
# Runs tests and generates code coverage of those tests in "/coverage"
gulp test
```
You should then see a ```docs/``` folder which contains an easy to use documentation navigation system.

### Roadmap

View the project roadmap [here](https://waffle.io/amber-elk/amber-elk)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
