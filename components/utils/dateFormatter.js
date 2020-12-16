module.exports = function(dateObj) {
    let date = dateObj;
    date = new Date(date);
    let months = 'January February March April May June July August September October November December';

    let dateStr = (months.split(' '))[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    let hr = date.getUTCHours();
    let min = date.getMinutes();
    min = min.toString();;
    min = (min.length < 2) ? min + '0' : min;
    let timeString = (hr < 12) ? `${hr}:${min}am` : `${hr - 12}:${min}pm`;
    timeString += ' UTC';

    let fullTimeString = `${ dateStr } (${ timeString })`;

    return { date: dateStr, time: timeString }
}
