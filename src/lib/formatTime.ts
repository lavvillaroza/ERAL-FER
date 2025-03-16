    export function formatDate(date: string) {
        const dateParse = new Date(date);
        return dateParse.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",  // "long" gives full month name (e.g., "March")
        day: "2-digit",
        });
  };

  // Function to convert 24-hour time to 12-hour format with AM/PM
  export function formatTime(time: string) {    
    if (!time) return "";
    if (time.includes("AM") || time.includes("PM") ) return time;
    
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = (hour % 12 || 12).toString().padStart(2, "0"); // Ensures two-digit hour format
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  export function convertTo24HourFormat(time12h: string) {
    const [time, modifier] = time12h.split(" ");
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(":").map(Number);
  
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };
