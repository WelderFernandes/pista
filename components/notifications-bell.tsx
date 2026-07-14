"use client";
import { Inbox } from "@novu/nextjs";
import { User } from "better-auth";
import { defaultLocalization } from "@/lib/novu/defaultLocalization";
import { useApp } from "@/lib/context";
import { useEffect, useState } from "react";
import { getSubscriberByEmail } from "@/lib/novu/novu";

const appearance = {
    elements: {
        bellIcon: ({ unreadCount }: { unreadCount: { total: number } }) => {
            if (unreadCount.total > 10) {
                return '[--bell-gradient-start:var(--color-red-500)] [--bell-gradient-end:var(--color-red-500)]';
            }
            return unreadCount.total > 1
                ? '[--bell-gradient-start:var(--color-yellow-500)] [--bell-gradient-end:var(--color-yellow-500)]'
                : '[--bell-gradient-start:var(--color-primary)] [--bell-gradient-end:var(--color-primary-900)]';
        },

    },
};

interface NotificationsBellProps {
    user: User | null;
    session: any;
    subscriberId?: string;
    sdjghfsdf?: string;
}

export default function NotificationsBell({ user, session, subscriberId, sdjghfsdf }: NotificationsBellProps) {
    const [subscriber, setSubscriber] = useState<any[]>([]);
    const appContext = useApp();
    const userId = user?.id || session?.user?.id;
    const resolvedSubscriberId = subscriberId || userId;

    useEffect(() => {
        async function fetchSubscriber() {
            if (user?.email) {
                const data = await getSubscriberByEmail(user.email);
                console.log("🚀 ~ fetchSubscriber ~ data:", data)
            }
        }
        fetchSubscriber();
    }, [user?.email]);

    console.log(`[Novu Inbox] Resolvido subscriberId: "${resolvedSubscriberId}" (User ID: "${userId}")`);

    return (
        <Inbox
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
            subscriberId={resolvedSubscriberId}
            backendUrl={process.env.NEXT_PUBLIC_NOVU_BACKEND_URL}
            socketUrl={process.env.NEXT_PUBLIC_NOVU_SOCKET_URL}
            appearance={appearance}
            localization={defaultLocalization}
        />
    );
}