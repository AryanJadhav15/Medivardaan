"use client";

import React, { useState } from "react";
import { Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TicketDetails() {
  const [issueTypeFilter, setIssueTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'update'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({ status: "", comment: "" });

  const issueTypes = [
      "Not able to Login", "Issue in Enquiry", "Issue in Followups", "Issue in Invoice", 
      "Issue in Inventory", "Issue in Expense", "Issue in Order History", 
      "Error While adding / Updating data", "Cannot find data", "Invoice Delete"
  ];
  const statusOptions = ["On Hold", "Closed", "In Progress", "Not an Issue", "Pending"];

  // Mock data
  const [tickets, setTickets] = useState([
    { id: 1, date: "25-Dec-2025", userName: "Vile-Parle east", issueType: "Invoice Delete", title: "To Delete the following invoice", issue: "MAH008182528, MAH008312528 MAH008312526 Vile-Parle east P101729 Suryabhan Yadav 6394914511 1,500 INV192336 Vile-Parle east P113443 lokesh panchal 9594582797 1,200 MAH004642526 Vile-Parle east P112918 dipak nagarseth 9820381759 30,000.00 20,000.00 10,000.00", attachment: "View Attachment", status: "Pending", comment: "" },
    { id: 2, date: "25-Dec-2025", userName: "Vile-Parle east", issueType: "Invoice Delete", title: "To Delete the following invoice", issue: "MAH008182528, MAH008312528 MAH008312526 Vile-Parle east P101729 Suryabhan Yadav 6394914511 1,500 INV192336 Vile-Parle east P113443 lokesh panchal 9594582797 1,200 MAH004642526 Vile-Parle east P112918 dipak nagarseth 9820381759 30,000.00 20,000.00 10,000.00", attachment: "View Attachment", status: "Pending", comment: "" },
    { id: 3, date: "25-Dec-2025", userName: "Porvorim", issueType: "Issue in Invoice", title: "extra amount entered", issue: "patient name:anton bondar invoice no:GOA010792526 Patient code P114076", attachment: "View Attachment", status: "Pending", comment: "" },
    { id: 4, date: "22-Dec-2025", userName: "Andheri West (Juhu)", issueType: "Invoice Delete", title: "invoice delete - juhu", issue: "There was revision in treatement services and discount end time, so had to make changes and make new bill. so please delete invoice 1) MAH007602528, 2) INV192087 and 3) MAH002332526.", attachment: "View Attachment", status: "Pending", comment: "" },
    { id: 5, date: "22-Dec-2025", userName: "POWAI", issueType: "Invoice Delete", title: "invoice delete 30/70", issue: "inv192237, date- 13/12/2025", attachment: "View Attachment", status: "Pending", comment: "" },
  ]);

  const filteredTickets = tickets.filter(t => {
      const matchIssue = issueTypeFilter && issueTypeFilter !== "all" ? t.issueType === issueTypeFilter : true;
      const matchStatus = statusFilter && statusFilter !== "all" ? t.status === statusFilter : true;
      // Basic date string match for demo purposes, could be enhanced with real date objs
      const matchFrom = fromDate ? t.date.includes(fromDate) : true; 
      const matchTo = toDate ? t.date.includes(toDate) : true;
      return matchIssue && matchStatus && matchFrom && matchTo;
  });

  const handleDelete = (id) => {
      if(confirm("Are you sure you want to delete this ticket?")) {
          setTickets(tickets.filter(t => t.id !== id));
      }
  };

  const handleSelect = (ticket) => {
      setSelectedTicket(ticket);
      setUpdateFormData({ status: ticket.status, comment: ticket.comment || "" });
      setViewMode("update");
  };

  const handleUpdateStatus = () => {
      setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: updateFormData.status, comment: updateFormData.comment } : t));
      alert("Ticket Status Updated Successfully!");
      setViewMode("list");
      setSelectedTicket(null);
  };

  if (viewMode === "update" && selectedTicket) {
      return (
          <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
               <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
                <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
                <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">IT / SUPPORT</h1>
              </div>

               <div className="space-y-6">
                  <div className="space-y-4">
                      {/* Read-only view of ticket details could go here if needed, but per SS only the update form is shown roughly */}
                      <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700 dark:text-white/75">Status</label>
                           <Select value={updateFormData.status} onValueChange={(val) => setUpdateFormData({...updateFormData, status: val})}>
                                <SelectTrigger className="w-full md:max-w-xs bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50">
                                <SelectValue placeholder="-- Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                </SelectContent>
                            </Select>
                      </div>
                      <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-white/75">Comment</label>
                            <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-lg"
                                value={updateFormData.comment}
                                onChange={(e) => setUpdateFormData({...updateFormData, comment: e.target.value})}
                            />
                      </div>

                       <div className="pt-4">
                         <Button 
                            className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors px-8"
                            onClick={handleUpdateStatus}
                         >
                            Submit
                        </Button>
                       </div>
                  </div>
               </div>
          </div>
      );
  }

  return (
    <div className="p-6 bg-white dark:bg-[#18122B] min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#443C68]/50 pb-4">
        <Settings className="w-5 h-5 text-medivardaan-teal dark:text-medivardaan-purple" />
        <h1 className="text-lg font-bold text-medivardaan-teal dark:text-medivardaan-purple uppercase tracking-wide">
          IT / SUPPORT
        </h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end w-full">
        <div className="w-full space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-white/75">Issue Type</label>
             <Select value={issueTypeFilter} onValueChange={setIssueTypeFilter}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full">
                <SelectValue placeholder="Select Issue Type" />
                </SelectTrigger>
                <SelectContent>
                 <SelectItem value="all">All</SelectItem>
                 {issueTypes.map(type => (
                     <SelectItem key={type} value={type}>{type}</SelectItem>
                 ))}
                </SelectContent>
            </Select>
        </div>
        <div className="w-full space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-white/75">Status</label>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full">
                <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statusOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
                </SelectContent>
            </Select>
        </div>

         <div className="w-full space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-white/75">Date</label>
            <Input
                type="date"
                placeholder="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                 className="bg-white dark:bg-[#393053] border-gray-300 dark:border-[#443C68]/50 w-full"
            />
        </div>
        {/* Search button logic is implicit in filters currently but a button can trigger a re-fetch if this was real API */}
         <div className="pb-0.5">
             <Button className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors font-medium shadow-sm transition-all whitespace-nowrap h-10 w-full">
                    Search
            </Button>
         </div>
      </div>

       <div className="flex justify-end text-sm text-gray-500 dark:text-white/50">
            Total : {filteredTickets.length}
        </div>

      {/* Table */}
       <div className="border border-gray-200 dark:border-[#443C68]/50 rounded-t-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10 dark:bg-[#393053]">
            <TableRow className="hover:bg-primary/10 dark:hover:bg-[#443C68]/50 border-gray-200 dark:border-[#443C68]/50">
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[60px]">Sr. No.</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[100px]">Date</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">User Name</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">Issue Type</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[200px]">Title</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75 w-[350px]">Issue</TableHead>
              <TableHead className="font-bold text-gray-700 dark:text-white/75">View Attachment</TableHead>
               <TableHead className="font-bold text-gray-700 dark:text-white/75">Status</TableHead>
                <TableHead className="font-bold text-gray-700 dark:text-white/75">Comment</TableHead>
                 <TableHead className="font-bold text-gray-700 dark:text-white/75">#</TableHead>
                  <TableHead className="font-bold text-gray-700 dark:text-white/75">#</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((row, index) => (
              <TableRow key={row.id} className="border-gray-200 dark:border-[#443C68]/50 dark:hover:bg-[#393053]/50">
                <TableCell className="dark:text-white/75">{index + 1}</TableCell>
                <TableCell className="dark:text-white/75 whitespace-nowrap">{row.date}</TableCell>
                <TableCell className="dark:text-white/75">{row.userName}</TableCell>
                <TableCell className="dark:text-white/75">{row.issueType}</TableCell>
                <TableCell className="dark:text-white/75 whitespace-normal break-words">{row.title}</TableCell>
                <TableCell className="dark:text-white/75 text-xs whitespace-normal break-words leading-relaxed">{row.issue}</TableCell>
                <TableCell className="dark:text-white/75 text-blue-500 cursor-pointer hover:underline text-center">{row.attachment}</TableCell>
                <TableCell className="dark:text-white/75">{row.status}</TableCell>
                <TableCell className="dark:text-white/75">{row.comment}</TableCell>
                <TableCell className="dark:text-white/75">
                    <Button 
                        onClick={() => handleSelect(row)}
                        className="bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-[#786bb0] text-white shadow-sm transition-colors h-8 text-xs px-4"
                    >
                        Select
                    </Button>
                </TableCell>
                <TableCell className="dark:text-white/75">
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                        onClick={() => handleDelete(row.id)}
                    >
                            <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
             {filteredTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center h-24 text-gray-500 dark:text-white/50">
                  No tickets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

         {/* Footer / Pagination */}
       <div className="flex justify-end items-center pt-2">
          {/* Pagination */}
        </div>
    </div>
  );
}
