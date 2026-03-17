'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get('date')
  const selectedClinic = searchParams.get('clinic')
  const selectedDoctor = searchParams.get('doctor')

  const [formData, setFormData] = useState({
    clinicName: selectedClinic || '',
    doctorName: selectedDoctor || '',
    appointmentNo: 'A12800',
    date: selectedDate || new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    age: '',
    dateOfBirth: '',
    gender: 'Male',
    mobileNo: '',
    email: '',
    telephoneNo: ''
  })

  const handleInputChange = (field, value) => {
    // strictly 10 digits for mobileNo and telephoneNo
    if (field === "mobileNo" || field === "telephoneNo") {
       const numericValue = value.replace(/\D/g, "");
       if (numericValue.length > 10) return;
       
       setFormData(prev => ({
         ...prev,
         [field]: numericValue
       }));
       return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-calculate age from date of birth
    if (field === 'dateOfBirth' && value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setFormData(prev => ({ ...prev, age: age - 1 }))
      } else {
        setFormData(prev => ({ ...prev, age }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate mandatory fields
    const mandatoryFields = {
      mobileNo: "Mobile No."
    };

    const missingFields = [];
    Object.entries(mandatoryFields).forEach(([field, label]) => {
      if (!formData[field] || formData[field].toString().trim() === "") {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      alert(`Please fill in the following mandatory fields:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    // Validate mobile number format
    if (formData.mobileNo.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    // Handle form submission - save to API
    alert('Appointment booked successfully!');
    router.push('/appointments/Book-Appointments')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18122B] py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="border border-gray-200 dark:border-[#443C68]/50 shadow-md bg-white dark:bg-[#393053]">
          <CardHeader className="p-4 bg-primary/10 dark:bg-primary/20 border-b border-primary/20 dark:border-primary/30">
            <h2 className="text-lg font-semibold text-primary dark:text-primary flex items-center gap-2">
              <Calendar className="w-5 h-5" /> BOOK APPOINTMENT
            </h2>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Clinic & Doctor Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Clinic & Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName" className="text-sm font-medium">
                      Clinic Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.clinicName}
                      onValueChange={(value) => handleInputChange('clinicName', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40">
                        <SelectValue placeholder="Select Clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Panvel">Panvel</SelectItem>
                        <SelectItem value="Mumbai">Mumbai</SelectItem>
                        <SelectItem value="Thane">Thane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctorName" className="text-sm font-medium">
                      Doctor Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.doctorName}
                      onValueChange={(value) => handleInputChange('doctorName', value)}
                    >
                      <SelectTrigger className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40">
                        <SelectValue placeholder="Select Doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                        <SelectItem value="Dr. Patel">Dr. Patel</SelectItem>
                        <SelectItem value="Dr. Kumar">Dr. Kumar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age (Years)
                    </Label>
                    <Input
                      id="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="bg-gray-100 dark:bg-[#393053] border-gray-300 dark:border-[#635985]/40"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Gender</Label>
                    <div className="flex gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Male"
                          checked={formData.gender === 'Male'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-[#0f7396] cursor-pointer accent-primary"
                        />
                        <span className="text-sm">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="Female"
                          checked={formData.gender === 'Female'}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-4 h-4 text-primary focus:ring-[#0f7396] cursor-pointer accent-primary"
                        />
                        <span className="text-sm">Female</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNo" className="text-sm font-medium">
                      Mobile No. <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mobileNo"
                      type="tel"
                      placeholder="Enter Mobile Number"
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telephoneNo" className="text-sm font-medium">
                      Telephone No.
                    </Label>
                    <Input
                      id="telephoneNo"
                      type="tel"
                      placeholder="Enter Telephone Number"
                      value={formData.telephoneNo}
                      onChange={(e) => handleInputChange('telephoneNo', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Schedule */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b pb-2">
                  Appointment Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Appointment Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="appointmentNo" className="text-sm font-medium">
                      Appointment No.
                    </Label>
                    <Input
                      id="appointmentNo"
                      value={formData.appointmentNo}
                      className="bg-gray-100 dark:bg-[#393053] border-gray-300 dark:border-[#635985]/40"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 dark:border-[#443C68]/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="px-8 border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-[#18122B] dark:border-[#635985]/40 dark:text-white/90 dark:hover:bg-[#393053]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors"
                >
                  Book Appointment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
