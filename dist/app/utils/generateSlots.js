export function generateSlots(startTime, endTime, slotDuration) {
    const slots = [];
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    let start = sh * 60 + sm;
    const end = eh * 60 + em;
    while (start + slotDuration <= end) {
        const slotStart = `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
        const slotEnd = `${String(Math.floor((start + slotDuration) / 60)).padStart(2, "0")}:${String((start + slotDuration) % 60).padStart(2, "0")}`;
        slots.push({ startTime: slotStart, endTime: slotEnd });
        start += slotDuration;
    }
    return slots;
}
