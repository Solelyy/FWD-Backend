## SuperAdmin Implementations

### Endpoints URL

- superadmin/management/status
     eg. superadmin/management/status?employee=1234

* status of an account eg. active & inactive
* for updates of status eg. inactivate and activate
* for basic updates

- superadmin/management/employment

* for updating also but involves employee status in the company eg. suspended

- superadmin/admins/actions

* for sensitive actions such as deleting a user

### Activate a admin user

Api endpoint: superadmin/management/status
Requirements:

- frontend must send a status body
- employeeId must be sent via url

sample: superadmin/management/status?employee=1234
body: {
status: ACTIVE (must match on db enum Status)
}
