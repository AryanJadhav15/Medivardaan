"use client";

import { getParameterTypeData } from "@/api/common";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import GenericTable from "@/components/common/GenericTable";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/useUser";

function ParameterType() {
  const router = useRouter();
  const parameterData = useSelector((state) => state.parameterType);
  const headerData = useSelector((state) => state.headerData);

  const [mounted, setMounted] = useState(false);

  // ✅ Handle client-only data safely
  useEffect(() => {
    setMounted(true);

  }, []);


    const user = useUser();
    
    // Check if user is loaded
    const UserID=user?.userData?.userId;
    const UserRole=user?.userData?.roleName;


  // Only fetch when user + other dependencies are ready
  const { data = [], isLoading } = useQuery({
    queryKey: [
      "parameterType",
      parameterData?.parameterTypeId,
      headerData?.region,
      UserID,
    ],
    queryFn: () =>
      getParameterTypeData(
        headerData?.region ?? "0",
        UserID,
        parameterData?.parameterTypeId
      ),
    enabled: mounted && !!parameterData && !!headerData && !!UserID,
  });

  // Define table columns once
  const columns = useMemo(
    () => [
      {
        header: "",
        accessorKey: "clinicName",
        cell: (info) => (
          <div className="font-semibold text-gray-900 dark:text-white">
            {info.getValue()}
          </div>
        ),
      },
      ...[
        "d1",
        "d2",
        "w1",
        "w2",
        "m1",
        "m2",
        "q1",
        "q2",
        "y1",
        "y2",
        "w1W2",
        "m1M2",
        "q1Q2",
        "y1Y2",
      ].map((key) => ({
        header: key.includes("W2") || key.includes("M2") || key.includes("Q2") || key.includes("Y2")
    ? key.replace(/(\d)([a-zA-Z])/g, '$1/$2').toUpperCase()  // Fix the format: insert slash between number and letter
    : key.toUpperCase(),  // Other key
        accessorKey: key,
        cell: (info) => (
          <div className="text-gray-900 dark:text-white">
            {info.getValue()}
          </div>
        ),
      })),
    ],
    []
  );

  // ✅ Render safely — only after mount
  if (!mounted || isLoading) {
    return     <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
<Spinner/></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#18122B] dark:to-[#18122B] p-6 space-y-8 transition-colors duration-300">
      {/* Back button */}
      <div
        className="m-0 flex items-center gap-2 font-semibold cursor-pointer text-gray-800 dark:text-white"
        onClick={() => router.back()}
      >
        <ArrowLeft size={18} /> <span>Go back to Grouped data</span>
      </div>

      {/* Card */}
      <Card className="bg-white/80 dark:bg-[#393053]/70 backdrop-blur-sm border dark:border-[#443C68]/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
            Branchwise Summary by {parameterData?.parameterName}
          </h3>

          <GenericTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}

export default ParameterType;
