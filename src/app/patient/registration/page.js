'use client'

import RegistrationForm from '@/components/patient/RegistrationForm'

export default function PatientRegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18122B] py-8">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Patient Registration</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">Register a new patient</p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}
