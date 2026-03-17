"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

export default function FollowupDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const followupId = searchParams.get('id');

  const [followupData, setFollowupData] = useState(null);
  const [followupForm, setFollowupForm] = useState({
    followupId: '',
    todayFollowupDate: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    conversationDetails: '',
    nextFollowupDate: '',
    status: '',
    interestLevel: '',
    followUpMode: '',
    remark: '',
  });

  useEffect(() => {
    // Load followup data from localStorage or API
    const storedData = localStorage.getItem(`followup_${followupId}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      setFollowupData(data);
      setFollowupForm({
        followupId: `F${data.srNo}`,
        todayFollowupDate: new Date().toISOString().split('T')[0],
        firstName: data.visitorName.split(' ')[0] || '',
        lastName: data.visitorName.split(' ').slice(1).join(' ') || '',
        conversationDetails: '',
        nextFollowupDate: '',
        status: '',
        interestLevel: '',
        followUpMode: '',
        remark: '',
      });
    }
  }, [followupId]);

  const handleFollowupFormChange = (field, value) => {
    setFollowupForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFollowupSubmit = (e) => {
    e.preventDefault();

    // Validate mandatory fields
    if (!followupForm.status) {
      alert('Please select a status');
      return;
    }

    console.log('Submitting followup:', followupForm);
    alert('Followup saved successfully!');
    router.push('/enquiry/enquiry-followups');
  };

  const handleCancel = () => {
    router.push('/enquiry/enquiry-followups');
  };

  if (!followupData) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-white/60">Loading followup details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-[#18122B] min-h-screen">
      {/* Header */}
      <PageHeader 
        title="FOLLOWUP DETAILS" 
        icon={Settings} 
      />

      {/* Followup Summary Section */}
      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Visitor Name</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.visitorName}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Address</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.assignedToCenter}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Source</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.sourceType}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Enquiry Date</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.enquiryDate}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Mobile No</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.mobileNo}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700 dark:text-white/75">Email Id</span>
                <span className="text-gray-600 dark:text-white/60">{followupData.emailId || '-'}</span>
              </div>
            </div>
          </div>

          {/* Previous Followups Table */}
          <div className="mt-4">
            <Table>
              <TableBody>
                <TableRow className="bg-[#0f7396]/10 dark:bg-[#635985]/20 border-b border-[#0f7396]/20">
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Sr. No.</TableCell>
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Conversation Date</TableCell>
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Follow up Mode</TableCell>
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Conversation Details</TableCell>
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Follow up Status</TableCell>
                  <TableCell className="font-semibold text-[#0f7396] dark:text-[#635985]">Follow up By</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>{followupData.enquiryDate}</TableCell>
                  <TableCell>{followupData.sourceType}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>Followup</TableCell>
                  <TableCell>{followupData.assignedToDoctor}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Today's Followup Information Form */}
      <Card className="border-gray-200 dark:border-[#443C68]/50">
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            TODAY'S FOLLOWUP INFORMATION
          </h3>
          <form onSubmit={handleFollowupSubmit} className="space-y-4">
            {/* Row 1: Followup ID and Today's Followup Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="followupId" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Followup ID <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="followupId"
                  value={followupForm.followupId}
                  readOnly
                  className="bg-gray-100 dark:bg-[#393053] h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="todayFollowupDate" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Today's FollowUp Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="todayFollowupDate"
                  type="date"
                  value={followupForm.todayFollowupDate}
                  onChange={(e) => handleFollowupFormChange('todayFollowupDate', e.target.value)}
                  className="border-gray-300 dark:border-[#443C68]/50 h-10"
                />
              </div>
            </div>

            {/* Row 2: First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={followupForm.firstName}
                  onChange={(e) => handleFollowupFormChange('firstName', e.target.value)}
                  className="border-gray-300 dark:border-[#443C68]/50 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={followupForm.lastName}
                  onChange={(e) => handleFollowupFormChange('lastName', e.target.value)}
                  className="border-gray-300 dark:border-[#443C68]/50 h-10"
                />
              </div>
            </div>

            {/* Row 3: Conversation details */}
            <div className="space-y-2">
              <Label htmlFor="conversationDetails" className="text-sm font-medium text-gray-700 dark:text-white/75">
                Conversation details
              </Label>
              <Textarea
                id="conversationDetails"
                value={followupForm.conversationDetails}
                onChange={(e) => handleFollowupFormChange('conversationDetails', e.target.value)}
                rows={3}
                className="border-gray-300 dark:border-[#443C68]/50 resize-none"
              />
            </div>

            {/* Row 4: Next FollowUp Date and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextFollowupDate" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Next FollowUp Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nextFollowupDate"
                  type="date"
                  value={followupForm.nextFollowupDate}
                  onChange={(e) => handleFollowupFormChange('nextFollowupDate', e.target.value)}
                  className="border-gray-300 dark:border-[#443C68]/50 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={followupForm.status}
                  onValueChange={(value) => handleFollowupFormChange('status', value)}
                >
                  <SelectTrigger className="border-gray-300 dark:border-[#443C68]/50 h-10">
                    <SelectValue placeholder="--- Select ---" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="in-process">In-process</SelectItem>
                    <SelectItem value="not-an-issue">Not an issue</SelectItem>
                    <SelectItem value="on-hold">On hold</SelectItem>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 5: Interest Level and Follow Up Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Interest Level <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={followupForm.interestLevel}
                  onValueChange={(value) => handleFollowupFormChange('interestLevel', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="interest1" />
                    <Label htmlFor="interest1" className="cursor-pointer font-normal">1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="interest2" />
                    <Label htmlFor="interest2" className="cursor-pointer font-normal">2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="interest3" />
                    <Label htmlFor="interest3" className="cursor-pointer font-normal">3</Label>
                  </div>
                
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="followUpMode" className="text-sm font-medium text-gray-700 dark:text-white/75">
                  Follow Up Mode <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="followUpMode"
                  value={followupForm.followUpMode}
                  onChange={(e) => handleFollowupFormChange('followUpMode', e.target.value)}
                  className="border-gray-300 dark:border-[#443C68]/50 h-10"
                />
              </div>
            </div>

            {/* Row 6: Remark */}
            <div className="space-y-2">
              <Label htmlFor="remark" className="text-sm font-medium text-gray-700 dark:text-white/75">
                Remark
              </Label>
              <Textarea
                id="remark"
                value={followupForm.remark}
                onChange={(e) => handleFollowupFormChange('remark', e.target.value)}
                rows={3}
                className="border-gray-300 dark:border-[#443C68]/50 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                type="submit"
                className="bg-[#0f7396] hover:bg-[#0f7396]/90 text-white px-8 h-10"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="border-gray-300 dark:border-[#443C68]/50 text-gray-700 dark:text-white/75 hover:bg-gray-50 dark:bg-[#18122B] dark:hover:bg-[#393053] px-8 h-10"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
