const monthNamesInIndonesian: Record<string, string> = {
  January: "Januari",
  February: "Februari",
  March: "Maret",
  April: "April",
  May: "Mei",
  June: "Juni",
  July: "Juli",
  August: "Agustus",
  September: "September",
  October: "Oktober",
  November: "November",
  December: "Desember",
};

export function formatDateToIndonesian(dateString: string): string {
  const formatSingleDate = (date: string) => {
    const parts = date.trim().split(" ");
    if (parts.length === 3) {
      // "dd MMMM yyyy"
      const day = parts[0];
      const month = monthNamesInIndonesian[parts[1]];
      const year = parts[2];
      if (!month) {
        throw new Error(`Bulan "${parts[1]}" tidak dikenali.`);
      }
      return `${day} ${month} ${year}`;
    } else if (parts.length === 2) {
      // "MMMM yyyy"
      const month = monthNamesInIndonesian[parts[0]];
      const year = parts[1];
      if (!month) {
        throw new Error(`Bulan "${parts[0]}" tidak dikenali.`);
      }
      return `${month} ${year}`;
    }
    return date;
  };

  if (dateString.includes(" - ")) {
    const dates = dateString.split(" - ");
    if (dates.length === 2) {
      return formatSingleDate(dates[0]) + " - " + formatSingleDate(dates[1]);
    }
  }

  return formatSingleDate(dateString);
}
