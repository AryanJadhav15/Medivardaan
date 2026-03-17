"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export default function RouteTransitionLoader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Anytime pathname changes, we stop loading (route finished)
        setLoading(false);
    }, [pathname]);

    // Provide a global way to trigger navigation with loading feedback
    useEffect(() => {
        // Monkey patch router.push to trigger loader start
        const originalPush = router.push;
        router.push = (...args) => {
            setLoading(true);
            startTransition(() => {
                originalPush.apply(router, args);
            });
        };

        return () => {
            router.push = originalPush; // restore on cleanup
        };
    }, [router, startTransition]);

    return (
        <div
            className={`fixed top-0 left-0 h-[3px] bg-blue-500 transition-[width,opacity] duration-500 ease-out ${
                loading || isPending ? "w-full opacity-100" : "w-0 opacity-0"
            }`}
        />
    );
}
