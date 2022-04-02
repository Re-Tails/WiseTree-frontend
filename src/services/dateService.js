const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export default function toShortDate(dateString) {
    const date = new Date(parseInt(dateString));
    return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}
