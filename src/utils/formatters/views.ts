function formatViews(n: number): string {
    if (n < 1000) return n.toString();

    const formatted = n / 1000;

    if (Number.isInteger(formatted)) {
        return formatted + 'к';
    } else {
        return formatted.toFixed(1) + 'к';
    }
}

export default formatViews;