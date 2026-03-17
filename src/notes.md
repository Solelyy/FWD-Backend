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
