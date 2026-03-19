"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * TableWrapper Component
 * 
 * Provides consistent card-gradient styling for all tables in the application.
 * Wraps around GenericTable, Table components, or plain HTML tables.
 * 
 * Usage:
 * <TableWrapper>
 *   <GenericTable data={data} columns={columns} />
 * </TableWrapper>
 * 
 * With custom styling:
 * <TableWrapper className="mt-4" contentClassName="p-2">
 *   <Table>...</Table>
 * </TableWrapper>
 */
const TableWrapper = React.forwardRef(
  ({ children, className, contentClassName, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("card-gradient p-0", className)}
        {...props}
      >
        <CardContent
          className={cn("p-4 overflow-x-auto", contentClassName)}
        >
          {children}
        </CardContent>
      </Card>
    );
  }
);

TableWrapper.displayName = "TableWrapper";

export { TableWrapper };
