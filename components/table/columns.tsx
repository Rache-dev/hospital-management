"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import AppointmentModal from "../AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
  {
    header: 'ID',
    cell: ({ row }) => <p className="text-14-medium">{ row.index + 1 }</p>
  }, {
    accessorKey: 'patient',
    header: 'Patient',
    cell:({row}) => {
        return <p className="text-14-medium">{row.original.patient.name}</p>
    },
  },
  {
    accessorKey: 'schedule',
    header: 'Date',
    cell: ({row}) => {
      return <p className="text-14-medium">{formatDateTime(row.original.schedule).dateTime}</p>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => (
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status} />
      </div>

    )
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({row}) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image src={doctor?.image!} alt="doctor" width={100} height={100} className="size-8" />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    }
  },
  {
    id: "actions",
    header: 'Actions',
    cell: ({ row : {original: data} }) => {      
      return (
        <div className="flex gap-1">
          <AppointmentModal type="schedule" patientId={data.patient.id} userId={data.userId} appointment={data}/>
          <AppointmentModal type="cancel" patientId={data.patient.id} userId={data.userId} appointment={data} />
        </div>
      )
    },
  },
]
