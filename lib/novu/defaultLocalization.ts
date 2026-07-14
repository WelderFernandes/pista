export const commonLocalization = {
    locale: 'pt-BR',
} as const;

export const defaultInboxLocalization = {
    ...commonLocalization,
    'inbox.filters.dropdownOptions.unread': 'Apenas não lidos',
    'inbox.filters.dropdownOptions.default': 'Não lidos & lidos',
    'inbox.filters.dropdownOptions.archived': 'Arquivados',
    'inbox.filters.dropdownOptions.snoozed': 'Adiados',
    'inbox.filters.labels.unread': 'Não lidos',
    'inbox.filters.labels.default': 'Caixa de Entrada',
    'inbox.filters.labels.archived': 'Arquivados',
    'inbox.filters.labels.snoozed': 'Adiados',
    'notifications.emptyNotice': 'Tudo calmo por aqui. Volte mais tarde.',
    'notifications.actions.readAll': 'Marcar todas como lidas',
    'notifications.actions.archiveAll': 'Arquivar todas',
    'notifications.actions.archiveRead': 'Arquivar lidas',
    'notifications.newNotifications': ({ notificationCount }: { notificationCount: number }) =>
        `${notificationCount > 99 ? '99+' : notificationCount} ${
            notificationCount === 1 ? 'nova notificação' : 'novas notificações'
        }`,
    'notification.actions.read.tooltip': 'Marcar como lida',
    'notification.actions.unread.tooltip': 'Marcar como não lida',
    'notification.actions.archive.tooltip': 'Arquivar',
    'notification.actions.unarchive.tooltip': 'Desarquivar',
    'notification.actions.snooze.tooltip': 'Adiar',
    'notification.actions.unsnooze.tooltip': 'Remover adiamento',
    'notification.snoozedUntil': 'Adiado até',
    'preferences.title': 'Preferências',
    'preferences.emptyNotice': 'Nenhuma preferência específica de notificação ainda.',
    'preferences.global': 'Preferências Globais',
    'preferences.schedule.title': 'Agendamento',
    'preferences.schedule.description': 'Permitir notificações entre:',
    'preferences.schedule.headerInfo':
        'Defina seu agendamento. As notificações para canais externos serão pausadas fora do agendamento. Notificações no aplicativo e críticas são sempre entregues.',
    'preferences.schedule.info': 'Notificações críticas e no aplicativo ainda chegam até você fora do seu agendamento.',
    'preferences.schedule.days': 'Dias',
    'preferences.schedule.from': 'De',
    'preferences.schedule.to': 'Para',
    'preferences.schedule.copyTimesTo': 'Copiar horários para',
    'preferences.schedule.sunday': 'Domingo',
    'preferences.schedule.monday': 'Segunda-feira',
    'preferences.schedule.tuesday': 'Terça-feira',
    'preferences.schedule.wednesday': 'Quarta-feira',
    'preferences.schedule.thursday': 'Quinta-feira',
    'preferences.schedule.friday': 'Sexta-feira',
    'preferences.schedule.saturday': 'Sábado',
    'preferences.schedule.dayScheduleCopy.title': 'Copiar horários para:',
    'preferences.schedule.dayScheduleCopy.selectAll': 'Selecionar todos',
    'preferences.schedule.dayScheduleCopy.apply': 'Aplicar',
    'preferences.workflow.disabled.notice':
        'Entre em contato com o administrador para habilitar o gerenciamento de inscrição para esta notificação crítica.',
    'preferences.workflow.disabled.tooltip': 'Entre em contato com o administrador para editar',
    'preferences.group.info': 'Aplica-se a todas as notificações sob este grupo.',
    'snooze.datePicker.timePickerLabel': 'Hora',
    'snooze.datePicker.apply': 'Aplicar',
    'snooze.datePicker.cancel': 'Cancelar',
    'snooze.options.anHourFromNow': 'Daqui a uma hora',
    'snooze.datePicker.pastDateTooltip': 'O horário selecionado deve ser pelo menos 3 minutos no futuro',
    'snooze.datePicker.noDateSelectedTooltip': 'Selecione uma data',
    'snooze.datePicker.exceedingLimitTooltip': ({ days }: { days: number }) =>
        `O horário selecionado não pode exceder ${days === 1 ? '24 horas' : `${days} dias`} a partir de agora`,
    'snooze.options.customTime': 'Horário personalizado...',
    'snooze.options.inOneDay': 'Amanhã',
    'snooze.options.inOneWeek': 'Próxima semana',
} as const;

export const defaultSubscriptionLocalization = {
    ...commonLocalization,
    'subscription.subscribe': 'Inscrever-se',
    'subscription.unsubscribe': 'Cancelar inscrição',
    'subscription.preferences.header': 'Gerenciar inscrição',
    'subscription.preferences.headerInfo':
        'Gerencie quais atualizações você gostaria de receber. Observação: As configurações globais e do fluxo de trabalho controlam a entrega e têm precedência quando desativadas.',
    'subscription.preferences.notSubscribed.header': 'Você não está inscrito.',
    'subscription.preferences.notSubscribed.description': 'Inscreva-se para receber atualizações sobre novas atividades.',
    'subscription.preferences.empty.header': 'Você está inscrito.',
    'subscription.preferences.empty.description': 'Nada para gerenciar no momento.',
} as const;

export const defaultLocalization = {
    ...defaultInboxLocalization,
    ...defaultSubscriptionLocalization,
} as const;

export const dynamicLocalization: Record<string, string> = {};

export function setDynamicLocalization(localization: Record<string, string>) {
    Object.assign(dynamicLocalization, localization);
}