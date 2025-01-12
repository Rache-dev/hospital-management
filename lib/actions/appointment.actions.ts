"use server";
 
import { formatDateTime, parseStringify } from "../utils";
import { ID, Query } from "node-appwrite"
import {  DATABASE_ID, APPOINTMENT_COLLECTION_ID, databases, messaging } from "../appwrite.config"
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";


export const createAppointment = async(appointment: CreateAppointmentParams) => {
    try{
        const newAppointment = await databases.createDocument(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(),appointment 
        )
        return parseStringify(newAppointment)
    } catch(error){
        console.log(error)
    }
}

export const getAppointment = async(appointmentId: string)=> {
    try{
        const appointment = await databases.getDocument(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId
        )
        return parseStringify(appointment)
    } catch(error){
        console.log(error)
    }
}
export const getRecentAppointmentList = async () => {
    try {
        //get all appoinmtnets
        const appointments = await databases.listDocuments(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!,  [Query.orderDesc('$createdAt')]
        )
        //set initial counts of appointment
        const initialCounts = {
            scheduledCount : 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
              switch (appointment.status) {
                case "scheduled":
                  acc.scheduledCount++;
                  break;
                case "pending":
                  acc.pendingCount++;
                  break;
                case "cancelled":
                  acc.cancelledCount++;
                  break;
              }
              return acc;
            },
            initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        }
        return parseStringify(data)
    } catch (error) {
        console.log(error)
    }
}

export const updateAppointment = async ({userId, appointmentId, type, appointment} : UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId, appointment
        )
        if (!updatedAppointment) {
            throw new Error('Appointment not found')
        }

        // sms notification
        const smsMessage = `Hey, it's CarePlus.
            ${type === 'schedule' ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule).dateTime} with Dr.${appointment.primaryPhysician} .`  :
                 `We regret to inform you that your appointment has been cancelled for the following reason : ${appointment.cancellationReason}`}
        `
        console.log("sms message", smsMessage)
        await sendSMSNotification(userId, smsMessage)
        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(), content, [], [userId]
        )
        return parseStringify(message)
    } catch (error) {
        console.log(error)
    }
}