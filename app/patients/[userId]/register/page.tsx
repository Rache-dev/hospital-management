import React from 'react'
import Image from 'next/image'
import RegisterForm from '@/components/form/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'

const Register = async (props: { params: Promise<{ userId: string }> }) => {
  const params = await props.params;
  const userId = params?.userId;
  const user = await getUser(userId)
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image src="/assets/icons/logo-full.svg" height={1000} width={1000} alt='patient' className="mb-12 h-10 w-fit" />
          <RegisterForm user={user} />

        <p className="copyright py-12">© Copyright 2024</p>
        </div>
      </section>
      <Image src="/assets/images/register-img.png"  height={1000} width={1000} alt='patient' className="side-img max-w-[390px]" />
    </div>
  )
}

export default Register