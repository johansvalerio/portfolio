export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    // Convertir a formato de 12 horas
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12; // Convierte el 0 (medianoche) a 12

    return `${dayName} ${dayNumber}/${month}/${year} \na las ${hours}:${minutes} ${ampm}`;
}