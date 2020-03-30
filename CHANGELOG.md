# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.1.7] - 2020-03-26

### Fixed

- Fixed usage of wrong version in languageserver-types

## [0.1.6] - 2020-03-26

### Added

- Goto Symbol for schema. This enables navigation to the used schema
- Support for `workspace/symbol` request of the lsp
- Server now sends the parsing-result in form of the schema, variables and diagnostics to the client

## [0.1.5] - 2020-02-02

- Bug Fixing

## [0.1.4] - 2020-02-02

### Changed

- Path in `USE SCHEMA` can now be relative from the parsed file or absolute

## [0.1.3] - 2020-01-24

### Changed

- Removed `./backend` folder from npm
- Fixed error in file resolving in `USE SCHEMA`

## [0.1.0] - 2020-01-16

### Changed

- Outsourced the REST-Backend starting to another NPM-Module
- Used the changed notification-messages of the `types`-project
- Renamed Repository

## [0.0.1]

- Initial Release
