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
