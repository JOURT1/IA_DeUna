export function getCurrentEcuadorDate(): Date {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Guayaquil',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        hourCycle: 'h23'
    }).formatToParts(new Date());

    const value = (type: string) => parts.find(part => part.type === type)?.value ?? '00';
    return new Date(
        Number(value('year')),
        Number(value('month')) - 1,
        Number(value('day')),
        Number(value('hour')),
        Number(value('minute')),
        Number(value('second'))
    );
}

export function toLocalDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function formatDateForLabel(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
}
