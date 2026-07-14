import { Inbox } from "@novu/nextjs";
import { User } from "better-auth";
import { defaultLocalization } from "@/lib/novu/defaultLocalization";
import { useApp } from "@/lib/context";

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
}

export default function NotificationsBell({ user, session, subscriberId }: NotificationsBellProps) {
    const appContext = useApp();
    const userId = user?.id || session?.user?.id;
    const email = user?.email || session?.user?.email;

    // Resolve o subscriber ID correto para o Novu:
    // 1. Se foi passado um prop explícito (ex: para testes), usa ele.
    // 2. Prefere usar o e-mail do usuário para consistência com assinantes do Novu.
    // 3. Caso contrário, cai de volta para o userId.
    const resolvedSubscriberId = subscriberId || email || userId;

    console.log(`[Novu Inbox] Resolvido subscriberId: "${resolvedSubscriberId}" (User ID: "${userId}", Email: "${email}")`);

    return (
        <Inbox
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
            subscriberId={user?.email || session?.user?.email}
            backendUrl={process.env.NEXT_PUBLIC_NOVU_BACKEND_URL}
            socketUrl={process.env.NEXT_PUBLIC_NOVU_SOCKET_URL}
            appearance={appearance}
            localization={defaultLocalization}
        />
    );
}