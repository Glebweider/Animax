const formattedTime = (timeInMs: number): string => {
    const seconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingMinutes = minutes % 60;
    let formattedTimeString = "";

    if (hours === 0 && minutes === 0 && seconds === 0) {
        return "0";
    }

    if (hours > 1) {
        formattedTimeString += `${hours} ч. `;
    } else {
        if (hours > 0) {
            formattedTimeString += `${hours} ч. `;
        }
        if (minutes > 0 || hours > 0) {
            formattedTimeString += `${remainingMinutes} мин. `;
        }
    }

    return formattedTimeString.trim();
}

export default formattedTime;