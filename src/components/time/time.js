
const time=()=>{
const now = new Date();
const formatted = now.toLocaleString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour12: true,
});
return formatted
}

export default time