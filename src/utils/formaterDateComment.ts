function formatDateComment(date: Date): string {
    const parsedDate = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - parsedDate.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffSeconds < 60) {
        return `${diffSeconds || 1}s`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    } else if (diffHours < 24) {
        return `${diffHours}h`;
    } else if (diffDays <= 3) {
        return `${diffDays}d`;
    } else {
        const day = parsedDate.getDate().toString().padStart(2, '0');
        const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
        return `${day}-${month}`;
    }
}

export default formatDateComment;
