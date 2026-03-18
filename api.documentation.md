## SuperAdmin Implementations

### Endpoints URL

- superadmin/management/status
  eg. superadmin/management/status?employee=1234

* this endpoint only receives status "status" in body with values ACTIVE & INACTIVE

- superadmin/management/employment?employee=1234
  eg. superadmin/management/employment?employee=1234

* this endpoint only receives "status" in body with a value of SUSPENDED

- superadmin/admins/actions
  eg superadmin/management/actions?employee=1234

* this triggers to changed the isDeleted (false) to true

### Activate a admin user & employee user

Api endpoint: superadmin/management/status
Requirements:

- frontend must send a "status" body
- employeeId must be sent via url with a param of "employee"
  eg. superadmin/management/status?employee=1234

  request must be look like:

  url: superadmin/management/status?employee=1234 => passed the employeeId thru param (employee)
  {
  "status" : "ACTIVE"
  }
