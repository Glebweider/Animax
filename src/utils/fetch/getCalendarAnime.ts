const getCalendarAnime = async () => {
    const response = await fetch(`https://shikimori.me/api/calendar`);
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        const errorData = await response.json();
        alert(errorData.message);
        return;
    }
}

export default getCalendarAnime;