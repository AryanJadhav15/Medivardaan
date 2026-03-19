"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    Calendar,
    FileText,
    ClipboardList,
    User,
    Stethoscope,
    Pill,
    Microscope,
    FileBarChart,
    Settings,
    Users,
    CreditCard,
    CalendarCheck,
    Receipt,
    Activity,
    Package,
    CircleHelp,
    UserCog,
    Headset,
} from "lucide-react";

import { useMenuData } from "@/hooks/useMenuData";
import { useUser } from "@/hooks/useUser";

// Function to get icon component for menu
const getMenuIcon = (menuName) => {
    const iconMap = {
        Dashboard: LayoutDashboard,
        Appointment: Calendar,
        Invoice: FileText,
        Lead: ClipboardList,
        Patient: User,
        Doctor: Stethoscope,
        Medicine: Pill,
        Lab: Microscope,
        Report: FileBarChart,
        Settings: Settings,
        User: Users,
        Users: Users,
        Payment: CreditCard,
        Schedule: CalendarCheck,
        Billing: Receipt,
        Pharmacy: Activity,
        Inventory: Package,
        Accounts: CreditCard,
        Help: CircleHelp,
        "Enquiry Settings": Settings,
        "User Settings": UserCog,
        Labs: Microscope,
        Reports: FileBarChart,
        Support: Headset,
    };

    const IconComponent = iconMap[menuName] || Activity;
    return <IconComponent size={18} strokeWidth={2} />;
};

export default function Sidebar({ open, onMenuClick }) {
    const pathname = usePathname();
    let userDetails = useUser();
    const UserRole = userDetails?.userData?.roleName;

    const { data, isLoading } = useMenuData(UserRole);

    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = useCallback((menuID) => {
        setOpenMenus((prev) => {
            if (prev[menuID]) {
                return {};
            }
            return { [menuID]: true };
        });
    }, []);

    // Add Dashboard menu
    const dashboardMenu = {
        menuID: "dashboard",
        menuName: "Dashboard",
        menuPath: null,
        menuChild: [
            {
                menuID: "admin-dashboard",
                menuName: "Admin",
                menuPath: "/dashboard/admin",
            },
            {
                menuID: "clinic-dashboard",
                menuName: "Clinic",
                menuPath: "/dashboard/clinic",
            },
            {
                menuID: "doctor-dashboard",
                menuName: "Doctor",
                menuPath: "/dashboard/doctor",
            },
        ],
    };

    // Add Doctor menu
    const doctorMenu = {
        menuID: "doctor-menu",
        menuName: "Doctor",
        menuPath: null,
        menuChild: [
            {
                menuID: "doctor-registration",
                menuName: "Doctor Registration",
                menuPath: "/doctor/doctor-registration",
            },
        ],
    };

    // Add Appointment menu
    const appointmentMenu = {
        menuID: "appointment-menu",
        menuName: "Appointment",
        menuPath: null,
        menuChild: [
            {
                menuID: "book-appointment",
                menuName: "Book Appointment",
                menuPath: "/appointments/Book-Appointments",
            },
            {
                menuID: "all-appointments-list",
                menuName: "All Appointments List",
                menuPath: "/appointments/all-appointments-list",
            },
            {
                menuID: "view-todays-confirmed",
                menuName: "View today's confirmed appointment",
                menuPath: "/appointments/view-todays-confirmed-appointment",
            },
            {
                menuID: "appointments-report",
                menuName: "Appointments Report",
                menuPath: "/appointments/appointments-report",
            },
        ],
    };

    // Add Invoice menu
    const invoiceMenu = {
        menuID: "invoice-menu",
        menuName: "Invoice",
        menuPath: null,
        menuChild: [
            {
                menuID: "generate-invoice",
                menuName: "Generate Invoice",
                menuPath: "/invoice/generate-invoice",
            },
            {
                menuID: "view-invoice",
                menuName: "View Invoice",
                menuPath: "/invoice/view-invoice",
            },
            {
                menuID: "cheque-invoice",
                menuName: "Cheque Invoice",
                menuPath: "/invoice/cheque-invoice",
            },
            {
                menuID: "cancellation-treatment",
                menuName: "Cancellation Treatment",
                menuPath: "/invoice/cancellation-treatment",
            },
            {
                menuID: "upgradation",
                menuName: "Upgradation",
                menuPath: "/invoice/upgradation",
            },
            {
                menuID: "bajaj-scheme-invoice",
                menuName: "Bajaj Scheme Invoice Report",
                menuPath: "/invoice/bajaj-scheme-invoice",
            },
            {
                menuID: "online-payment-invoice",
                menuName: "Card / UPI Invoice Report",
                menuPath: "/invoice/online-payment-invoice",
            },
            {
                menuID: "finance-reconciliation",
                menuName: "Finance Reconciliation",
                menuPath: "/invoice/finance-reconciliation",
            },
            {
                menuID: "payment-collection",
                menuName: "Payment Collection",
                menuPath: "/invoice/payment-collection",
            },
        ],
    };

    // Add Lead menu
    const leadMenu = {
        menuID: "lead-menu",
        menuName: "Lead",
        menuPath: null,
        menuChild: [
            {
                menuID: "new-lead",
                menuName: "New Lead",
                menuPath: "/enquiry/new-enquiry",
            },
            {
                menuID: "lead-followups",
                menuName: "Lead Followups",
                menuPath: "/enquiry/enquiry-followups",
            },
            {
                menuID: "pending-followups",
                menuName: "Pending Followups",
                menuPath: "/enquiry/pending-followups",
            },
            {
                menuID: "follow-up-report",
                menuName: "Followups",
                menuPath: "/enquiry/follow-up-report",
            },
            {
                menuID: "non-converted-leads",
                menuName: "Non-Converted Leads",
                menuPath: "/enquiry/non-converted-leads",
            },
            {
                menuID: "upload-leads",
                menuName: "Upload Leads",
                menuPath: "/enquiry/upload-leads",
            },
            {
                menuID: "area-manager-leads",
                menuName: "Area Manager Leads",
                menuPath: "/enquiry/area-manager-leads",
            },
        ],
    };

    // Add Patient Details menu (MIS)
    const patientDetailsMenu = {
        menuID: "patient-details-menu",
        menuName: "Patient",
        menuPath: null,
        menuChild: [
            {
                menuID: "all-patient-list",
                menuName: "All Patient List",
                menuPath: "/patient/all-patient-list",
            },
            {
                menuID: "patient-search",
                menuName: "Patient Search",
                menuPath: "/MIS/patient-search",
            },
            {
                menuID: "consultation",
                menuName: "Consultation",
                menuPath: "/MIS/consultation",
            },
            {
                menuID: "new-patient-report",
                menuName: "New Patient Report",
                menuPath: "/MIS/new-patient-report",
            },
            {
                menuID: "patient-visit-report",
                menuName: "Patient Visit Report",
                menuPath: "/MIS/patient-visit-report",
            },
            {
                menuID: "repeat-patient-report",
                menuName: "Repeat Patient Report",
                menuPath: "/MIS/repeat-patient-report",
            },
            {
                menuID: "patient-clinic-transfer",
                menuName: "Patient Clinic Transfer",
                menuPath: "/MIS/patient-clinic-transfer",
            },
            {
                menuID: "patient-merge-delete",
                menuName: "Patient Merge and Delete",
                menuPath: "/MIS/patient-merge-delete",
            },
            {
                menuID: "visitor",
                menuName: "Visitor",
                menuPath: "/MIS/visitor",
            },
            {
                menuID: "consent",
                menuName: "Consent",
                menuPath: "/MIS/consent",
            },
        ],
    };

    // Add Report menu
    const reportMenu = {
        menuID: "report-menu-local",
        menuName: "Reports",
        menuPath: null,
        menuChild: [
            {
                menuID: "doctor-report",
                menuName: "Doctor Collection Report",
                menuPath: "/report/doctor-collection-report",
            },
            {
                menuID: "contact-details",
                menuName: "Contact Details",
                menuPath: "/report/contact-details",
            },
            {
                menuID: "order-history",
                menuName: "Order History",
                menuPath: "/report/order-history",
            },
            {
                menuID: "doctor-attendance-report",
                menuName: "Doctor Attendance Report",
                menuPath: "/report/doctor-attendance-report",
            },
            {
                menuID: "medicines-collection-report",
                menuName: "Medicines Collection Report",
                menuPath: "/report/medicines-collection-report",
            },
            {
                menuID: "treatments-report",
                menuName: "Treatments Report",
                menuPath: "/report/treatments-report",
            },
            {
                menuID: "login-details",
                menuName: "Login Details",
                menuPath: "/report/login-details",
            },
            {
                menuID: "treatments-count-report",
                menuName: "Treatments Count Report",
                menuPath: "/report/treatments-count-report",
            },
            {
                menuID: "revenue-report",
                menuName: "Revenue Report",
                menuPath: "/report/revenue-report",
            },
            {
                menuID: "transaction-report",
                menuName: "Transaction Report",
                menuPath: "/report/transaction-report",
            },
            {
                menuID: "cheque-report",
                menuName: "Cheque Report",
                menuPath: "/report/cheque-report",
            },
            {
                menuID: "patientwise-collection-report",
                menuName: "Patientwise Collection Report",
                menuPath: "/report/patientwise-collection-report",
            },
            {
                menuID: "payment-mode-report",
                menuName: "Payment Mode Report",
                menuPath: "/report/payment-mode-report",
            },
            {
                menuID: "payment-mode-clinic-report",
                menuName: "Payment Mode Clinic Report",
                menuPath: "/report/payment-mode-clinic-report",
            },
        ],
    };

    // Add Accounts menu
    const accountsMenu = {
        menuID: "accounts-menu-local",
        menuName: "Accounts",
        menuPath: null,
        menuChild: [
            {
                menuID: "patients-medicines-collection-report",
                menuName: "Patients Medicines Collection Report",
                menuPath: "/accounts/patients-medicines-collection-report",
            },
            {
                menuID: "accountant-expense",
                menuName: "Accountant Expense",
                menuPath: "/accounts/accountant-expense",
            },
            {
                menuID: "area-manager-report",
                menuName: "Area Manager Report",
                menuPath: "/accounts/area-manager-report",
            },
            {
                menuID: "area-manager-collection-report",
                menuName: "Area Manager Collection Report",
                menuPath: "/accounts/area-manager-collection-report",
            },
            {
                menuID: "clinic-medicines-collection-report",
                menuName: "Clinic Medicines Collection Report",
                menuPath: "/accounts/clinic-medicines-collection-report",
            },
            {
                menuID: "expense-entry",
                menuName: "Expense Entry",
                menuPath: "/accounts/expense-entry",
            },
            {
                menuID: "expense-report",
                menuName: "Expense Report",
                menuPath: "/accounts/expense-report",
            },
            {
                menuID: "clinic-expense-report",
                menuName: "Clinic Expense Report",
                menuPath: "/accounts/clinic-expense-report",
            },
            {
                menuID: "clinic-collection-report",
                menuName: "Clinic Collection Report",
                menuPath: "/accounts/clinic-collection-report",
            },

            {
                menuID: "accounts-patientwise-collection-report",
                menuName: "Patientwise Collection Report",
                menuPath: "/report/patientwise-collection-report",
            },
            {
                menuID: "accounts-payment-mode-report",
                menuName: "Payment Mode Report",
                menuPath: "/report/payment-mode-report",
            },
            {
                menuID: "accounts-payment-mode-clinic-report",
                menuName: "Payment Mode Clinic Report",
                menuPath: "/report/payment-mode-clinic-report",
            },
        ],
    };

    // Add Inventory menu
    const inventoryMenu = {
        menuID: "inventory-menu",
        menuName: "Inventory",
        menuPath: null,
        menuChild: [
            {
                menuID: "clinic-stock",
                menuName: "Clinic Stock",
                menuPath: "/inventory/clinic-stock",
            },
            {
                menuID: "head-office-stock",
                menuName: "Head Office Stock",
                menuPath: "/inventory/head-office-stock",
            },
            {
                menuID: "request-inventory",
                menuName: "Request Inventory",
                menuPath: "/inventory/request-inventory",
            },
            {
                menuID: "view-request-inventory",
                menuName: "View Request Inventory",
                menuPath: "/inventory/view-request-inventory",
            },
            {
                menuID: "view-order-history",
                menuName: "View Order History",
                menuPath: "/inventory/view-order-history",
            },
            {
                menuID: "clinic-stock-report",
                menuName: "Clinic Stock Report",
                menuPath: "/inventory/clinic-stock-report",
            },
            {
                menuID: "purchase-order",
                menuName: "Purchase Order",
                menuPath: "/inventory/purchase-order",
            },
            {
                menuID: "purchase-order-received",
                menuName: "Purchase Order Received",
                menuPath: "/inventory/purchase-order-received",
            },
            {
                menuID: "purchase-order-receive-report",
                menuName: "Purchase Order Receive Report",
                menuPath: "/inventory/purchase-order-receive-report",
            },
            {
                menuID: "clinic-request-stock-send-report",
                menuName: "Clinic Request Stock Send Report",
                menuPath: "/inventory/clinic-request-stock-send-report",
            },
        ],
    };

    // // Add Doctor menu
    // const doctorMenu = {
    //   menuID: 'doctor-menu',
    //   menuName: 'Doctor',
    //   menuPath: null,
    //   menuChild: [
    //     {
    //       menuID: 'doctor-registration',
    //       menuName: 'Doctor Registration',
    //       menuPath: '/doctor/doctor-registration'
    //     }
    //   ]
    // };

    // Add Help menu
    const helpMenu = {
        menuID: "help-menu",
        menuName: "Help",
        menuPath: "/help",
        menuChild: [],
    };

    // Add Enquiry Settings menu
    const enquirySettingsMenu = {
        menuID: "enquiry-settings-menu",
        menuName: "Enquiry Settings",
        menuPath: "/enquiry-settings",
        menuChild: [],
    };

    // Add User Settings menu
    const userSettingsMenu = {
        menuID: "user-settings-menu",
        menuName: "User Settings",
        menuPath: null,
        menuChild: [
            {
                menuID: "employee",
                menuName: "Employee",
                menuPath: "/user-settings/employee",
            },
            {
                menuID: "user-access",
                menuName: "User Access",
                menuPath: "/user-settings/user-access",
            },
            {
                menuID: "area-manager",
                menuName: "Area Manager",
                menuPath: "/user-settings/area-manager",
            },
        ],
    };

    // Add Inventory Settings menu
    const inventorySettingsMenu = {
        menuID: "inventory-settings-menu",
        menuName: "Inventory Settings",
        menuPath: null,
        menuChild: [
            {
                menuID: "vendor",
                menuName: "Vendor",
                menuPath: "/inventory-settings/vendor",
            },
            {
                menuID: "item-master",
                menuName: "Item Master",
                menuPath: "/inventory-settings/item-master",
            },
            {
                menuID: "brand",
                menuName: "Brand",
                menuPath: "/inventory-settings/brand",
            },
            {
                menuID: "packaging-type",
                menuName: "Packaging Type",
                menuPath: "/inventory-settings/packaging-type",
            },
            {
                menuID: "vendor-type",
                menuName: "Vendor Type",
                menuPath: "/inventory-settings/vendor-type",
            },
            {
                menuID: "inventory-type",
                menuName: "Inventory Type",
                menuPath: "/inventory-settings/inventory-type",
            },
        ],
    };

    // Add Lab Settings menu
    const labSettingsMenu = {
        menuID: "lab-settings-menu",
        menuName: "Labs",
        menuPath: null,
        menuChild: [
            {
                menuID: "lab-service-master",
                menuName: "Lab Service Master",
                menuPath: "/lab-settings/lab-service-master",
            },
            {
                menuID: "lab-service-mapping",
                menuName: "Lab Service Mapping",
                menuPath: "/lab-settings/lab-service-mapping",
            },
            {
                menuID: "lab-master",
                menuName: "Lab Master",
                menuPath: "/lab-settings/lab-master",
            },
            {
                menuID: "lab-order-pending",
                menuName: "Lab Order Pending",
                menuPath: "/lab-settings/lab-order-pending",
            },
        ],
    };

    const clinicSettingsMenu = {
        menuID: "clinic-settings-menu",
        menuName: "Settings",
        menuPath: null,
        menuChild: [
            {
                menuID: "branch-profile",
                menuName: "Add Clinic Profile",
                menuPath: "/clinic-settings/branch-profile",
            },
            {
                menuID: "treatments",
                menuName: "Treatments",
                menuPath: "/clinic-settings/treatments",
            },
            {
                menuID: "medical-problem",
                menuName: "Medical Problem",
                menuPath: "/clinic-settings/medical-problem",
            },

            {
                menuID: "medicines",
                menuName: "Medicines",
                menuPath: "/clinic-settings/medicines",
            },
            {
                menuID: "branch-handover",
                menuName: "Branch Handover",
                menuPath: "/clinic-settings/branch-handover",
            },
            enquirySettingsMenu,
            inventorySettingsMenu,
            labSettingsMenu,
            inventoryMenu,
            userSettingsMenu,
        ],
    };

    const offerMenu = {
        menuID: "offer-menu",
        menuName: "Offer",
        menuPath: null,
        menuChild: [
            {
                menuID: "offer-type",
                menuName: "Offer Type",
                menuPath: "/offer/offer-type",
            },
            {
                menuID: "offer-list",
                menuName: "Offer",
                menuPath: "/offer/offer-list",
            },
        ],
    };

    const couponMenu = {
        menuID: "coupon-menu",
        menuName: "Coupon",
        menuPath: null,
        menuChild: [
            {
                menuID: "company",
                menuName: "Company",
                menuPath: "/coupon/company",
            },
            {
                menuID: "coupon-generate",
                menuName: "Coupon Generate",
                menuPath: "/coupon/generate",
            },
            {
                menuID: "assigned-coupon",
                menuName: "Assigned Coupon",
                menuPath: "/coupon/assigned",
            },
        ],
    };

    // Append Appointment, Invoice, Lead, Patient Details, Doctor, Accounts, and Report menus to the data
    // Append Appointment, Invoice, Lead, Patient Details, Doctor, Accounts, and Report menus to the data
    const supportMenu = {
        menuID: "support-menu",
        menuName: "Support",
        menuPath: null,
        menuChild: [
            {
                menuID: "add-ticket",
                menuName: "Add Ticket",
                menuPath: "/clinic-settings/add-ticket",
            },
            {
                menuID: "ticket-details",
                menuName: "View Ticket",
                menuPath: "/clinic-settings/ticket-details",
            },
        ],
    };

    // Modified: removed nested settings items from top level
    const menuData = data
        ? [
              ...data,
              dashboardMenu,
              clinicSettingsMenu,
              doctorMenu,
              leadMenu,
              patientDetailsMenu,
              appointmentMenu,
              invoiceMenu,
              reportMenu,
              supportMenu,
          ]
        : [
              dashboardMenu,
              clinicSettingsMenu,
              doctorMenu,
              leadMenu,
              patientDetailsMenu,
              appointmentMenu,
              invoiceMenu,
              reportMenu,
              supportMenu,
          ];

    if (isLoading) return <div>Loading...</div>;

    // Helper function to check if this menu or any of its children is active
    const checkIsActive = (menuItem) => {
        if (menuItem.menuPath && pathname === menuItem.menuPath) return true;
        if (menuItem.menuChild && menuItem.menuChild.length > 0) {
            return menuItem.menuChild.some((child) => checkIsActive(child));
        }
        return false;
    };

    // Recursive function to render menu items
    const renderMenuItem = (menu, depth = 0, topLevelMenuID = null) => {
        const effectiveTopLevelID = depth === 0 ? menu.menuID : topLevelMenuID;
        const hasChildren = menu.menuChild && menu.menuChild.length > 0;
        const isExpanded = !!openMenus[menu.menuID];
        const isActive = checkIsActive(menu);

        // Improved nesting logic:
        // Level 0: px-2 (standard)
        // Level 1: pl-2 (ultra tight spacing)
        // Level 2: pl-4
        const basePadding = "px-2";
        const nestedPadding =
            depth > 0 ? `pl-${2 + (depth - 1) * 2}` : basePadding;

        const renderIcon = (menuName, depth, hasChildren) => {
            if (depth === 0) {
                return (
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-medivardaan-teal to-medivardaan-blue text-white shadow-lg flex-shrink-0 group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
                        {getMenuIcon(menuName)}
                    </div>
                );
            }

            // For nested items
            return (
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-150">
                    {hasChildren && (
                        <span className="text-medivardaan-teal/70 group-hover:text-medivardaan-blue group-hover:scale-125 transition-colors duration-150">
                            {getMenuIcon(menuName)}
                        </span>
                    )}
                </div>
            );
        };

        if (!hasChildren) {
            return (
                <Link
                    key={menu.menuID}
                    href={menu.menuPath || "#"}
                    onClick={() => {
                        // Close all menus — the active-only rendering will show just this selected item
                        setOpenMenus({});
                        // Expand sidebar if collapsed
                        onMenuClick?.();
                    }}
                    className={cn(
                        "flex items-center gap-2 text-sm font-medium rounded-lg transition-all duration-150 group relative",
                        "hover:shadow-sm dark:text-white dark:hover:bg-white/15",
                        open
                            ? "py-2 px-2.5 justify-start"
                            : "py-1.5 px-3 justify-center",
                        isActive &&
                            "shadow-sm bg-transparent dark:bg-[#393053]/15 dark:text-white text-medivardaan-teal",
                        !isActive && "hover:text-medivardaan-teal",
                        depth > 0 ? nestedPadding : open ? "px-2" : "p-1.5",
                        depth > 0 && !open && "hidden",
                    )}
                >
                    {/* Animated background glow on hover and active */}
                    <div
                        className={cn(
                            "absolute inset-0 rounded-lg transition-all duration-150 -z-10 bg-gradient-to-r from-medivardaan-teal/20 to-medivardaan-blue/20",
                            isActive
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-30",
                        )}
                    ></div>

                    {/* Always render icon container for alignment if open, or if depth 0 */}
                    {(open || depth === 0) &&
                        renderIcon(menu.menuName, depth, false)}

                    {open && (
                        <span
                            className={cn(
                                "font-medium truncate transition-colors duration-150",
                                depth > 0 &&
                                    !isActive &&
                                    "text-muted-foreground group-hover:text-medivardaan-teal dark:text-white/80 dark:group-hover:text-white/95",
                                depth > 0 &&
                                    isActive &&
                                    "text-medivardaan-teal dark:text-white",
                            )}
                        >
                            {menu.menuName}
                        </span>
                    )}
                </Link>
            );
        }

        // recursive case
        return (
            <div key={menu.menuID}>
                <Collapsible
                    open={isExpanded}
                    onOpenChange={() => {
                        toggleMenu(menu.menuID);
                        onMenuClick?.();
                    }}
                >
                    <CollapsibleTrigger asChild>
                        <button
                            className={cn(
                                "w-full flex items-center gap-2 text-left group relative rounded-lg transition-all duration-150",
                                "hover:shadow-sm dark:text-white dark:hover:bg-white/15",
                                open
                                    ? "py-2 px-2.5 justify-start"
                                    : "py-1.5 px-3 justify-center",
                                isActive &&
                                    "shadow-sm bg-transparent dark:bg-[#393053]/15 dark:text-white text-medivardaan-teal",
                                !isActive && "hover:text-medivardaan-teal",
                                depth > 0
                                    ? nestedPadding
                                    : open
                                      ? "px-2"
                                      : "p-1.5",
                                depth > 0 && !open && "hidden",
                            )}
                        >
                            {/* Animated background glow */}
                            <div
                                className={cn(
                                    "absolute inset-0 rounded-lg transition-all duration-150 -z-10 bg-gradient-to-r from-medivardaan-teal/20 to-medivardaan-blue/20",
                                    isActive
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-30",
                                )}
                            ></div>

                            {/* Always render icon container for alignment */}
                            {(open || depth === 0) &&
                                renderIcon(menu.menuName, depth, true)}

                            {open && (
                                <>
                                    <span
                                        className={cn(
                                            "flex-1 text-sm font-medium truncate transition-colors duration-150",
                                            depth > 0 &&
                                                !isActive &&
                                                "text-muted-foreground group-hover:text-medivardaan-teal dark:text-white/80 dark:group-hover:text-white/95",
                                            depth > 0 &&
                                                isActive &&
                                                "text-medivardaan-teal dark:text-white",
                                        )}
                                    >
                                        {menu.menuName}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronDown
                                            size={16}
                                            className={cn(
                                                "transition-colors duration-150 group-hover:text-medivardaan-teal",
                                                isActive
                                                    ? "text-medivardaan-teal"
                                                    : "text-muted-foreground",
                                            )}
                                        />
                                    ) : (
                                        <ChevronRight
                                            size={16}
                                            className={cn(
                                                "transition-colors duration-150 group-hover:text-medivardaan-teal",
                                                isActive
                                                    ? "text-medivardaan-teal"
                                                    : "text-muted-foreground",
                                            )}
                                        />
                                    )}
                                </>
                            )}
                        </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent
                        className={cn(
                            "overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up",
                            !open && "hidden",
                        )}
                    >
                        <div className="mt-1 flex flex-col space-y-0.5 pl-2 border-l-2 border-slate-200/30 dark:border-slate-700/30">
                            {menu.menuChild.map((child) =>
                                renderMenuItem(
                                    child,
                                    depth + 1,
                                    effectiveTopLevelID,
                                ),
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* When collapsed, show only the active sub-option(s) */}
                {!isExpanded &&
                    menu.menuChild
                        .filter((child) => checkIsActive(child))
                        .map((child) => (
                            <div
                                key={`active-${child.menuID}`}
                                className="mt-1 flex flex-col space-y-0.5 pl-2 border-l-2 border-medivardaan-teal/20"
                            >
                                {renderMenuItem(
                                    child,
                                    depth + 1,
                                    effectiveTopLevelID,
                                )}
                            </div>
                        ))}
            </div>
        );
    };

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 h-screen flex flex-col transition-[width] duration-300",
                "bg-gradient-to-b from-white via-slate-50/80 to-white dark:from-[#18122B] dark:via-[#393053]/80 dark:to-[#18122B]",
                "border-r border-slate-200/50 dark:border-[#443C68]/50",
                "shadow-lg shadow-slate-200/5 dark:shadow-[#18122B]/20",
                "text-foreground",
                open ? "w-64" : "w-16",
            )}
        >
            <div className="flex items-center justify-center h-16 border-b border-slate-200/50 dark:border-[#443C68]/50 flex-shrink-0 bg-gradient-to-r from-medivardaan-teal/3 to-medivardaan-blue/3 dark:bg-medivardaan-purple-deep overflow-hidden">
                {open ? (
                    <>
                        <Image
                            src="/medivardaan-logo-transparent-2.png"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "110px", height: "95px" }}
                            alt="MediVardaan Logo"
                            className="object-fill dark:hidden"
                        />
                        <Image
                            src="/medivardaan-logo-transparent-2.png"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "110px", height: "95px" }}
                            alt="MediVardaan Logo"
                            className="object-fill hidden dark:inline-block dark:overflow-y-hidden dark:invert dark:brightness-0"
                        />
                    </>
                ) : (
                    <>
                        <Image
                            src="/medivardaan-logo-transparent-2.png"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "auto", height: "65px" }}
                            alt="MediVardaan Logo"
                            className="object-contain dark:hidden"
                        />
                        <Image
                            src="/medivardaan-logo-transparent-2.png"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "auto", height: "65px" }}
                            alt="MediVardaan Logo"
                            className="object-contain hidden dark:block dark:brightness-0 dark:invert dark:opacity-80"
                        />
                    </>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-4 space-y-1 px-3 pb-6 no-scrollbar">
                {menuData?.map((menu) => renderMenuItem(menu, 0))}
            </nav>
        </aside>
    );
}
