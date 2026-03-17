"use client";
import { reportsService } from "@/api/reports";
import GenericTable from "@/components/common/GenericTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

function page() {
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["clinicWiseReport", fromDate, toDate],
    queryFn: () => reportsService.getPatientWiseReport(fromDate, toDate),
    // enabled: !!fromDate && !!toDate,
  });

  const columns = useMemo(
    () => [
      {
        header: "Clinic Name",
        accessorKey: "clinicName",
      },
      {
        header: "No. of Leads",
        accessorKey: "noOfLeads",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "Appointments",
        accessorKey: "appointments",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "Walk-ins",
        accessorKey: "visitors",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "No. of Patients",
        accessorKey: "noOfPatients",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "Revenue",
        accessorKey: "revenue",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "Procedure",
        accessorKey: "procedure",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
      {
        header: "Revenue per Patient",
        accessorKey: "revenuePerPatient",
        cell: (info) => {
          const value = info.getValue();
          return <p className=''>{Number(value)?.toLocaleString("en-IN")}</p>
        }
      },
    ],
    []
  );
  return (
    <>
      <div className="min-h-screen">
        {/* Back button */}
        {/* <div
        className="m-0 flex items-center gap-2 font-semibold cursor-pointer text-gray-800 dark:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} /> <span>Go back to Grouped data</span>
      </div> */}

        {/* Card */}
        <Card className="card-gradient mt-0">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
              Clinic Wise Report
            </h3>

            {/* Date Range Filters */}
            <div className="flex items-end gap-3 mb-6">
              <div className="w-36">
                <Label htmlFor="fromDate" className="mb-1 text-sm pl-1">
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setfromDate(e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>
              <div className="w-36">
                <Label htmlFor="toDate" className="mb-1 text-sm pl-1">
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => settoDate(e.target.value)}
                  className="mt-1 h-9 text-sm"
                />
              </div>

              {/* Refresh Icon */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => refetch()}
                      className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-[#443C68] dark:hover:bg-[#443C68] rounded-md flex items-center justify-center"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="text-center text-gray-600 dark:text-white/75">
                Loading report...
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="text-center text-red-600">
                Error loading report
              </div>
            )}

            {/* No data state */}
            {!isLoading && !data && (
              <div className="text-center text-gray-500 dark:text-white/50">
                Select dates to generate report
              </div>
            )}

            {/* Table */}
            {data && <GenericTable columns={columns} data={data} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default page;
