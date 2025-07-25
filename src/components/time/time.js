const time = () => {
  const now = new Date();

  const hour = now.toLocaleString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const day = now.getDate().toString().padStart(2, "0"); 
  const month = now.toLocaleString("en-GB", { month: "long" });
  const year = now.getFullYear();

  return `${hour}, ${day} ${month}, ${year}`;
};

export default time;
