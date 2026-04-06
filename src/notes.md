### Querying

1. relation query when querying a not pk table
2. for crud operation use crud query

### Querying Url

## there is 2 types of getting specific data on url

1. by @Query this means the route must be sample/verify-email?token=
   @Get(verify-email)
   @Query('token', token: string)
2. by @Param this means the route must be sample/verify-email/token
   @Get(verify-email/:token)
   @Param('token', token: string)
3. If a

## NestJS

### Modules

1. u dont need to export services in each feature module to import it on bootstrap module - app.module, as long as the feature will not be used by another feature, thus you need to export the services.

### Body

- @Body("sample) only receives a body contains a sample json only, but none it set and has a dto, then the json must be match the dto shape.

## Execution Context

- execution context is a class with methods to be used to extract metadatas at the requests and often used at guards such as guard for roles checking session token if valid.

In NestJS, the ExecutionContext class extends ArgumentsHost to provide more details about the current
execution process, typically used in guards, filters, and interceptors.

1. getClass():
   Returns the type of the Controller class to which the current handler belongs.

2. getHandler():
   Returns a reference to the specific handler (method) about to be invoked.

3. getType():
   Returns the type of the current application context (e.g., 'http', 'rpc', or 'ws').

4. switchToHttp():
   Returns an object providing methods appropriate for an HTTP context.

5. switchToRpc():
   Returns an object providing methods for a Microservice (RPC) context.

6. switchToWs():
   Returns an object providing methods for a WebSockets context.

NOTE: Ip address is default attached in every web request, hence it can be extracted using this class Execution Context
