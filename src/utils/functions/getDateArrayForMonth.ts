import { IDate } from "@Interfaces/ReleaseScreen.interface";


export const getDateArrayForMonth = (): IDate[] => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const dateArray: IDate[] = [];
    const currentDate = new Date(firstDayOfMonth);
    const weekDayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });

    while (currentDate <= lastDayOfMonth) {
        const curYear = currentDate.getFullYear();
        const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const curDay = String(currentDate.getDate()).padStart(2, '0');

        dateArray.push({
            dayOfWeek: weekDayFormatter.format(currentDate),
            dayOfMonth: currentDate.getDate().toString(),
            dayOfDate: `${curYear}-${curMonth}-${curDay}`
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};