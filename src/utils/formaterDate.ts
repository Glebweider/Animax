const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInTime = now.getTime() - parsedDate.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    if (diffInDays === 0) {
        return `Today, at ${hours}:${minutes}`;
    } else if (diffInDays === 1) {
        return `Yesterday, at ${hours}:${minutes}`;
    } else {
        return `${String(parsedDate.getDate()).padStart(2, '0')}.${String(parsedDate.getMonth() + 1).padStart(2, '0')}.${parsedDate.getFullYear()}`;
    }
};

export default formatDate;
