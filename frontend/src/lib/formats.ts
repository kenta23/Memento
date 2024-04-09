export function formatDate (date: string) {
    const newdate = new Date(date);

    const formatDateTime = new Intl.DateTimeFormat('en-US', {
         month: 'numeric',
         day: 'numeric',
         year: 'numeric',
         hour12: true
    }).format(newdate);

    return formatDateTime;
}