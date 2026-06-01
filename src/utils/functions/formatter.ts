type DateInput = string | Date;

export const Formatter = {
    date(date: DateInput): string {
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime()))
            return 'Invalid date';

        const now = Date.now();
        const diffDays = Math.floor(
            (now - parsedDate.getTime()) / 86400000
        );

        const hours = String(parsedDate.getHours()).padStart(2, '0');
        const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

        if (diffDays === 0)
            return `Today, at ${hours}:${minutes}`;

        if (diffDays === 1)
            return `Yesterday, at ${hours}:${minutes}`;

        return `${String(parsedDate.getDate()).padStart(2, '0')}.${String(parsedDate.getMonth() + 1).padStart(2, '0')}.${parsedDate.getFullYear()}`;
    },

    commentDate(date: DateInput): string {
        const parsedDate = new Date(date);

        const diffMs = Date.now() - parsedDate.getTime();

        const seconds = Math.floor(diffMs / 1000);
        if (seconds < 60)
            return `${seconds || 1}s`;

        const minutes = Math.floor(diffMs / 60000);
        if (minutes < 60)
            return `${minutes}m`;

        const hours = Math.floor(diffMs / 3600000);
        if (hours < 24)
            return `${hours}h`;

        const days = Math.floor(diffMs / 86400000);
        if (days <= 3)
            return `${days}d`;

        return `${String(parsedDate.getDate()).padStart(2, '0')}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
    },

    time(date: DateInput): string {
        const parsedDate = new Date(date);

        return `${String(parsedDate.getHours()).padStart(2, '0')}:${String(parsedDate.getMinutes()).padStart(2, '0')}`;
    },

    mmss(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    duration(ms: number): string {
        const seconds = Math.floor(ms / 1000);

        if (seconds === 0)
            return '0';

        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const remainingMinutes = minutes % 60;

        if (hours > 0)
            return `${hours} ч. ${remainingMinutes} мин.`;

        return `${minutes} мин.`;
    },

    playerTime(ms: number): string {
        const totalSeconds = Math.floor(ms / 1000);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    views(n: number): string {
        if (n < 1000) return String(n);

        const value = n / 1000;

        return Number.isInteger(value)
            ? `${value}k`
            : `${value.toFixed(1)}k`;
    },
};