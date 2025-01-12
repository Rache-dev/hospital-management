import React from 'react'
import Image from 'next/image'
import AppointmentForm from '@/components/form/AppointmentForm'
import { getUser, getPatient } from '@/lib/actions/patient.actions'

const NewAppointment = async (props: SearchParamProps) => {
  const params = await props.params;

  const {
    userId
  } = params;

  const patient = await getPatient(userId)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image src="/assets/icons/logo-full.svg" height={1000} width={1000} alt='patient' className="mb-12 h-10 w-fit" />
          <AppointmentForm type="create" userId={userId} patientId={patient.$id} />

        <p className="copyright mt-10 py-12">© 2024 Careplus</p>
        </div>
      </section>
      <Image src="/assets/images/register-img.png"  height={1000} width={1000} alt='patient' className="side-img max-w-[390px] bg-bottom" />
    </div>
  )
}

export default NewAppointment