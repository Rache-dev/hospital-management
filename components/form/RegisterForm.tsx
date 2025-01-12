"use client"

import React from 'react';
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import  SubmitButton from "../SubmitButton"
import { Form, FormControl} from "../ui/form"
import CustomFormField from "../CustomFormField"
import { PatientFormValidation } from "../../lib/validation";
import { useRouter } from "next/navigation"
import { registerPatient } from "../../lib/actions/patient.actions";
import "react-phone-number-input/style.css";
import { FormFieldType } from "../form/PatientForm";
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues} from '@/constants';
import { Label } from '../ui/label';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import FileUploader from '../FileUploader';
 
const RegisterForm = ({user} : {user: User}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user ? user.name : "",
      email: user ? user.email : "",
      phone: user ? user.phone : "",
    },
  })
 
  async function onSubmit (values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true)
    
    let formData ;
    if(values.identificationDocument && values.identificationDocument.length > 0) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type
      })
      formData = new FormData()
      formData.append('blobFile', blobFile)
      formData.append('fileName', values.identificationDocument[0].type)
    }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData
      }
      //ts-ignore
      const patient = await registerPatient(patientData)
      console.log('Patient Data', patient)
      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    }catch(error){
      console.log(error)
    }
    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="name" placeholder="Full Name" iconSrc="/assets/icons/user.svg" iconAlt="user" />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} 
            name="email" label="Email address" placeholder="johndoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="email" />
          <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} 
            name="phone" label="Phone number" placeholder="+123 456 743" />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.DATE_PICKER} 
              name="birthDate" label="Date of Birth"/>
          <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON} 
            name="gender" label="Gender" renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className='flex h-11 gap-6 xl:justify-between' onValueChange={field.onChange} defaultValue={field.value}>{
                GenderOptions.map((option) => (
                  <div key={option} className='radio-group'>
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className='cursor-pointer'>{ option }</Label>
                  </div>
                ))
                }</RadioGroup>
              </FormControl>
            )} />
        </div>
            
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="address" label="Address" placeholder="14th Street New York" />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="occupation" label="Occupation" placeholder="Software Engineer" />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="emergencyContactName" label="Emergency Contact Name" placeholder="Guardian's Name" />
          <CustomFormField control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="emergencyContactNumber" label="Emergency Contact Name" placeholder="+123 456 743" />
        </div>
        {/* Medical Information */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name="primaryPhysician" label="Primary Physician" placeholder="Select a Physician">
            {Doctors.map((doctor) => (
              <SelectItem key={doctor.name} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image src={doctor.image} width={24} height={24} alt={doctor.name} className="rounded-full border border-dark-500" />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insuranceProvider" label="Insurance provider" placeholder="ex: BlueCross" />
          <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="insurancePolicyNumber" label="Insurance policy number" placeholder="ex: ABC1234567" />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="allergies" label="Allergies (if any)" placeholder="ex: Peanuts, Penicillin, Pollen" />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="currentMedication" label="Current Medications" placeholder="ex: ibuprofen 200mg" />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="familyMedicalHistory" label="Family medical history (if any)" placeholder="ex: Mother had cancer" />
          <CustomFormField control={form.control} fieldType={FormFieldType.TEXTAREA} name="pastMedicalHistory" label="Past medical history (if any)" placeholder="ex: Asthma diagnosis in childhood" />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField control={form.control} fieldType={FormFieldType.SELECT} name="identificationType" placeholder="Identification Type" label="Select identification type">
          {IdentificationTypes.map((identificationType) => (
            <SelectItem key={identificationType} value={identificationType}>
              <p>{identificationType}</p>
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField control={form.control} fieldType={FormFieldType.INPUT} name="identificationNumber" label="Identification Number" placeholder="ex: 123456" />
        <CustomFormField control={form.control} fieldType={FormFieldType.SKELETON} 
            name="IdentificationDocument" label="Scanned copy of identification document" 
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )} />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="treatmentConsent" label="I consent to receive treatment for my health condition." />
        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="disclosureConsent" label="I consent to the use and disclosure of my health information for treatment purposes." />
        <CustomFormField control={form.control} fieldType={FormFieldType.CHECKBOX} name="privacyConsent" label="I acknowledge that I have reviewed and agree to the privacy policy" />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm