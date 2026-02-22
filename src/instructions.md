## download all added libraries

npm install

## generate a table based on schema

npx prisma migrate dev --name init
//note only run this if your local db is on

## generate a client

npx prisma generate

you have you local database yoho

## create a hashed password

go to diretory dump then run node hash.pass.ts
copy the hashed password

## login on postgre with your user, local db name and host if on terminal

start your postgresql
psql -U user -d localdbname -h localhost

## start inserting

INSERT INTO "User" (
"employeeId",
"firstname",
"lastname",
"email",
"role",
"status",
"passwordHash",
"dataPolicyAccepted",
"provider",
"isApproved",
"isVerified",
"verificationToken",
"verificationExpiration",
"authCurrentToken",
"authTokenExpiresAt"
) VALUES (
'EMP001',
'yourname',
'yourlastname',
'john.doe@company.com',
'SUPER_ADMIN',
'ACTIVE',
'yourhasedpass',
true,
'LOCAL',
true,
true,
NULL,  
 NULL,  
 NULL,
NULL  
);

## run backedn server

npm run start:dev
//you should see server started
//to see other scripts, run npm run

## test wwith frontend

now the route ready o revceive
route "auth/login"
