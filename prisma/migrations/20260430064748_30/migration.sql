-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'EXPIRED', 'SUSPENDED', 'REMOVED');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'GOOGLE');

-- CreateEnum
CREATE TYPE "attendance_Status" AS ENUM ('NO_RECORD', 'IN_PROGRESS', 'COMPLETED', 'ON_LEAVE', 'SUSPENDED', 'MISSING_TIMEOUT', 'OVERTIME_REQUEST');

-- CreateEnum
CREATE TYPE "OvertimeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CashAdvanceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ReimbursmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('SICK', 'VACATION', 'ACCUMULATED', 'OTHER');

-- CreateEnum
CREATE TYPE "ReimbursementType" AS ENUM ('FOOD', 'TRANSPORTATION', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "session" TEXT,
    "invitationDate" TEXT,
    "verificationToken" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isDataPolicyAccepted" BOOLEAN NOT NULL DEFAULT false,
    "vacationLeaveBalance" INTEGER NOT NULL DEFAULT 6,
    "sickLeaveBalance" INTEGER NOT NULL DEFAULT 6,
    "otherBalance" INTEGER NOT NULL DEFAULT 6,
    "accumulatedLeave" INTEGER NOT NULL DEFAULT 0,
    "remainingOvertimeHours" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_attendance" (
    "attendanceId" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "canTimeIn" BOOLEAN NOT NULL DEFAULT true,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeIn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timeOut" TIMESTAMP(3),
    "timeInLoc" TEXT,
    "timeOutLoc" TEXT,
    "timeInImg" TEXT,
    "timeOutImg" TEXT,
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "isOvertime" BOOLEAN NOT NULL DEFAULT false,
    "isUndertime" BOOLEAN NOT NULL DEFAULT false,
    "overtimeHours" DOUBLE PRECISION,
    "status" "attendance_Status" NOT NULL DEFAULT 'NO_RECORD',
    "totalHours" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "editedByAdminId" TEXT,

    CONSTRAINT "tbl_attendance_pkey" PRIMARY KEY ("attendanceId")
);

-- CreateTable
CREATE TABLE "tbl_overtime" (
    "id" SERIAL NOT NULL,
    "attendance_id" INTEGER NOT NULL,
    "requested_hours" DOUBLE PRECISION,
    "time_out" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "time_out_loc" TEXT,
    "overtime_status" "OvertimeStatus" NOT NULL DEFAULT 'PENDING',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "tbl_overtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_leave" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveType" "LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days_requested" INTEGER,
    "reason" TEXT,
    "attachment" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validateAt" TIMESTAMP(3),
    "validated_by" TEXT,

    CONSTRAINT "tbl_leave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_cashadvance" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amountRequested" INTEGER,
    "amountApproved" INTEGER,
    "reason" TEXT,
    "status" "CashAdvanceStatus" NOT NULL DEFAULT 'PENDING',
    "dateSubmitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approved_by" TEXT,
    "approvedBy" TEXT,

    CONSTRAINT "tbl_cashadvance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_reimbursements" (
    "id" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amountRequested" INTEGER,
    "amountApproved" INTEGER,
    "reason" TEXT,
    "type" "ReimbursementType" NOT NULL,
    "status" "ReimbursmentStatus" NOT NULL DEFAULT 'PENDING',
    "dateSubmitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approved_by" TEXT,
    "approvedBy" TEXT,

    CONSTRAINT "tbl_reimbursements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_status_idx" ON "User"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_overtime_attendance_id_key" ON "tbl_overtime"("attendance_id");

-- AddForeignKey
ALTER TABLE "tbl_attendance" ADD CONSTRAINT "tbl_attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_overtime" ADD CONSTRAINT "tbl_overtime_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_overtime" ADD CONSTRAINT "tbl_overtime_attendance_id_fkey" FOREIGN KEY ("attendance_id") REFERENCES "tbl_attendance"("attendanceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_leave" ADD CONSTRAINT "tbl_leave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_cashadvance" ADD CONSTRAINT "tbl_cashadvance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_reimbursements" ADD CONSTRAINT "tbl_reimbursements_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;
