## Project Tree Structure

.
├── auth
├── email
├── interface
│ └── auth
├── prisma_global
├── users
│ ├── controller
│ ├── dto
│ ├── module
│ ├── service
│ └── test
└── utils
└── security

Folders like shared globally eg. utils, middleware etc are at src

## Naming

The file should be in a name format "filename.foldername.ts"

### Notes

1. Use DTO when needs validation and transformation. Mainly used at Controllers
2. Use interfaces for services, such as returning a data to Controller
3. Services uses DTO but only for receiving the data from controller

## Authentication

1. Data that needs validation must be check by auth

## Externals

1. brevo esp
