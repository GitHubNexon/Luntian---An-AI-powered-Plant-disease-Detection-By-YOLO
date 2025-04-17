const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../json/cities.json");

// Load the JSON file
let cities = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Update each entry
cities = cities.map(city => {
  let updatedName = city.name;

  if (city.city === true && !city.name.endsWith(" City")) {
    updatedName += " City";
  }

  return {
    name: updatedName,
    province: city.province
  };
});

// Save the updated JSON
fs.writeFileSync(filePath, JSON.stringify(cities, null, 2), "utf-8");

console.log("✅ City names updated and 'city' fields removed.");
