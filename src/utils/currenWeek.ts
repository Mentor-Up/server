export default function getCurrentWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday - 0
  console.log('today', dayOfWeek);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0); // Set the time to midnight

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set the time to the end of the day

  return { weekStart: startOfWeek, weekEnd: endOfWeek };
}
