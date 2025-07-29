export function formatSnakeCase(value) {
  if (value === undefined) return "N/A";
  if (typeof value === "number") return value;

  if (!value || typeof value !== "string") return "";

  return value
    .replace(/[-_]/g, " ") // replaces both _ and - with space
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
