"use client";
import { useUser } from "@/hooks/useUser";
import GenericTable from "@/components/common/GenericTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useDoctorsData } from "@/hooks/useDoctorsData";
import { Select } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query";
import { DivideCircle } from "lucide-react";
import { DivideSquare } from "lucide-react";
import { Activity } from "lucide-react";
import { Check } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { IndianRupee } from "lucide-react";
import { Users } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useClinics } from "@/hooks/useClinics";

function page() {
  const router = useRouter(); // ✅ Initialize router
  const userDetails = useUser();
  const [open, setOpen] = useState(false);
  const [openClinic, setOpenClinic] = useState(false);
  const [value, setValue] = useState("");
  const [valueClinic, setValueClinic] = useState("");

  const UserID = userDetails?.userData?.userId;
  const UserRole = userDetails?.userData?.roleName;

  const {
    data: DoctorsList,
    isLoading,
    isError: DoctorListError,
  } = useDoctorsData(UserRole == "1" ? UserID : valueClinic);

  const {
    data: ClinicList,
    isClinicLoading,
    isError: ClinicListError,
  } = useClinics();

  const {
    data: clinicData,
    isLoading: clinicLoading,
    isError,
    error: clinicError,
  } = useQuery({
    queryKey: ["clinicDashboardCount", UserID, valueClinic, value],
    queryFn: () =>
      dashboardCount.getClinicDashboardCountData(
        UserRole == "1" ? UserID : valueClinic,
        value,
      ),
    // enabled:!!user && !!value,
    // staleTime: 1000 * 60 * 5, // optional cache time (5 mins)
  });

  let cardsData = clinicData?.[0];

  const statCards = [
    {
      title: "Patients",
      value: Number(cardsData?.patients),
      key: "patients",
      icon: (
        <Users className="w-5 h-5 text-medivardaan-teal-light dark:text-medivardaan-purple-light/80" />
      ),
    },
    {
      title: "Procedures",
      value: Number(cardsData?.procedures),
      key: "procedures",
      icon: (
        <Activity className="w-5 h-5 text-medivardaan-teal-light dark:text-medivardaan-purple-light/80" />
      ),
    },
    {
      title: "Revenue",
      value: Number(cardsData?.revenue),
      key: "revenue",
      icon: (
        <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
      ),
    },
    {
      title: "Revenue / Patient",
      value: Number(cardsData?.revenuePatient),
      key: "revenuePatient",
      icon: (
        <DivideSquare className="w-5 h-5 text-medivardaan-blue dark:text-medivardaan-blue/80" />
      ),
    },
    {
      title: "Revenue / Procedure",
      value: Number(cardsData?.revenueProcedure),
      key: "revenueProcedure",
      icon: (
        <DivideCircle className="w-5 h-5 text-medivardaan-blue dark:text-medivardaan-blue/80" />
      ),
    },
  ];

  const data = [
    {
      rpl: "Patients",
      d1: 25,
      d2: 30,
      d3: 28,
    },
    {
      rpl: "Leads",
      d1: 15,
      d2: 18,
      d3: 20,
    },
  ];

  const columns = [
    {
      accessorKey: "parameters",
      header: "",
      cell: ({ row }) => (
        <span
          className="text-left"
          // className="underline text-blue-600 dark:text-[#635985] hover:text-blue-500 hover:cursor-pointer"
        >
          {row.original.parameters}
        </span>
      ),
    },
    ...["d1", "d2", "d3"].map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? Number(val).toLocaleString("en-IN") : "-";
      },
      sortingFn: "alphanumeric",
    })),
  ];

  const columnsWeeks = [
    {
      accessorKey: "parameters",
      header: "",
      cell: ({ row }) => (
        <span

        // className="underline text-blue-600 dark:text-[#635985] hover:text-blue-500 hover:cursor-pointer"
        >
          {row.original.parameters}
        </span>
      ),
    },
    ...["w1", "w2", "w3"].map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? Number(val).toLocaleString("en-IN") : "-";
      },
      sortingFn: "alphanumeric",
    })),
  ];

  const columnsMonths = [
    {
      accessorKey: "parameters",
      header: "",
      cell: ({ row }) => (
        <span

        // className="underline text-blue-600 dark:text-[#635985] hover:text-blue-500 hover:cursor-pointer"
        >
          {row.original.parameters}
        </span>
      ),
    },
    ...["m1", "m2", "m3"].map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? Number(val).toLocaleString("en-IN") : "-";
      },
      sortingFn: "alphanumeric",
    })),
  ];

  const columnsQuarters = [
    {
      accessorKey: "parameters",
      header: "",
      cell: ({ row }) => (
        <span

        // className="underline text-blue-600 dark:text-[#635985] hover:text-blue-500 hover:cursor-pointer"
        >
          {row.original.parameters}
        </span>
      ),
    },
    ...["q1", "q2", "q3"].map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? Number(val).toLocaleString("en-IN") : "-";
      },
      sortingFn: "alphanumeric",
    })),
  ];

  const columnsYears = [
    {
      accessorKey: "parameters",
      header: "",
      cell: ({ row }) => (
        <span

        // className="underline text-blue-600 dark:text-[#635985] hover:text-blue-500 hover:cursor-pointer"
        >
          {row.original.parameters}
        </span>
      ),
    },
    ...["y1", "y2", "y3"].map((key) => ({
      accessorKey: key,
      header: key.toUpperCase(),
      cell: ({ getValue }) => {
        const val = getValue();
        return val ? Number(val).toLocaleString("en-IN") : "-";
      },
      sortingFn: "alphanumeric",
    })),
  ];

  if (isLoading || isClinicLoading || clinicLoading)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#4DB8AC]/5 to-[#1E6B8C]/5 dark:from-[#18122B] dark:to-[#18122B] p-6 space-y-8 transition-colors duration-300">
        <header className="w-full bg-gradient-to-r from-[#4DB8AC]/10 via-[#1E6B8C]/10 to-[#4DB8AC]/10 dark:bg-gradient-to-r dark:from-[#393053] dark:via-[#443C68] dark:to-[#393053] border border-[#4DB8AC]/20 dark:border-[#443C68]/50 rounded-lg shadow-sm px-6 py-4 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Section */}
          {/* <div className="flex items-center gap-2">
        <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-[#635985]" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
      </div> */}

          {/* Right Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-end">
            {/* Region Selector */}
            {/* <Select
        //   onValueChange={(value) => {
        //     setRegion(value);
        //     dispatch(setHeaderData({ region: value, period: null }));
        //   }}
        //   value={region}
        >
          <SelectTrigger className="w-[160px] bg-white dark:bg-[#393053] border border-gray-300 dark:border-[#443C68]/50 rounded-md text-sm font-medium">
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            {[
              { regionName: "All", regionValue: "0" },
              { regionName: "East", regionValue: "1" },
              { regionName: "West", regionValue: "2" },
              { regionName: "North", regionValue: "3" },
              { regionName: "South", regionValue: "4" },
              { regionName: "Central", regionValue: "5" },
            ].map((r) => (
              <SelectItem key={r.regionValue} value={r.regionValue}>
                {r.regionName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
            {UserRole == "2" ? (
              <Popover open={openClinic} onOpenChange={setOpenClinic}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClinic}
                    className="w-[200px] justify-between"
                  >
                    {valueClinic
                      ? ClinicList?.find(
                          (framework) => framework.clinicId === valueClinic,
                        )?.clinicName
                      : "Select Clinic..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search clinic..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No Clinic found.</CommandEmpty>
                      <CommandGroup>
                        {ClinicList?.map((framework) => (
                          <CommandItem
                            key={framework.clinicId}
                            value={framework.clinicName}
                            onSelect={(currentValue) => {
                              setValueClnic(
                                framework.clinicId === valueClinic
                                  ? ""
                                  : framework.clinicId,
                              );
                              setOpenClinic(false);
                              setValue("");
                            }}
                          >
                            {framework?.clinicName}
                            <Check
                              className={cn(
                                "ml-auto",
                                valueClinic === framework?.clinicId
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : (
              ""
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? DoctorsList?.find(
                        (framework) => framework.doctorID === value,
                      )?.doctorName
                    : "Select Doctor..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search doctor..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No Doctor found.</CommandEmpty>
                    <CommandGroup>
                      {DoctorsList?.map((framework) => (
                        <CommandItem
                          key={framework.doctorID}
                          value={framework.doctorName}
                          onSelect={(currentValue) => {
                            setValue(
                              framework.doctorID === value
                                ? ""
                                : framework.doctorID,
                            );
                            setOpen(false);
                          }}
                        >
                          {framework?.doctorName}
                          <Check
                            className={cn(
                              "ml-auto",
                              value === framework?.doctorID
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <div className="pt-4 space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {statCards.map((item) => {
              const rawValue = item.value;
              const formattedValue = item.key.includes("revenue")
                ? `₹ ${Number(rawValue || 0).toLocaleString("en-IN")}`
                : Number(rawValue || 0).toLocaleString("en-IN");
              return (
                <Card
                  key={item.title}
                  className="card-gradient text-center shadow-md hover:shadow-xl transition-all"
                >
                  <CardContent className="p-5 flex flex-col items-center space-y-2">
                    <div>{item.icon}</div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-white/60">
                      {item.title}
                    </p>
                    <h2 className="text-l whitespace-nowrap font-bold text-gray-900 dark:text-white">
                      {" "}
                      {formattedValue}
                    </h2>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          <section className="grid grid-cols-2 gap-4">
            <Card className="card-gradient p-0 transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                  Last 3 days Summary
                </h3>

                <GenericTable
                  data={clinicData?.[0]?.daysSummarylist}
                  columns={columns}
                  showSorting={false}
                  showPagination={false}
                />
              </CardContent>
            </Card>
            <Card className="card-gradient p-0 transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                  Last 3 Weeks Summary
                </h3>

                <GenericTable
                  data={clinicData?.[0]?.weeksSummarylist}
                  columns={columnsWeeks}
                  showSorting={false}
                  showPagination={false}
                />
              </CardContent>
            </Card>
            <Card className="card-gradient p-0 transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                  Last 3 Months Summary
                </h3>

                <GenericTable
                  data={clinicData?.[0]?.monthsSummarylist}
                  columns={columnsMonths}
                  showSorting={false}
                  showPagination={false}
                />
              </CardContent>
            </Card>
            <Card className="card-gradient p-0 transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                  Last 3 Quarters Summary
                </h3>

                <GenericTable
                  data={clinicData?.[0]?.quartersSummarylist}
                  columns={columnsQuarters}
                  showSorting={false}
                  showPagination={false}
                />
              </CardContent>
            </Card>
            <Card className="card-gradient p-0 transition-all">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
                  Last 3 Years Summary
                </h3>

                <GenericTable
                  data={clinicData?.[0]?.yearsSummarlist}
                  columns={columnsYears}
                  showSorting={false}
                  showPagination={false}
                />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

export default page;
