type ParsedObject = { [key: string]: any };

export function parseFormData(formData: FormData) {
  let result: ParsedObject = {};

  // Iterate over each form data entry
  for (let [key, value] of formData) {
    let current = result;
    let keys = key.split(/[\.\[\]]/).filter((k) => k !== ""); // Split the key into parts and filter out empty strings

    keys.forEach((k, index) => {
      // Check if it's the last key
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        // Initialize the next level in the structure if it doesn't exist
        if (!current[k]) {
          current[k] = isNaN(parseInt(keys[index + 1] || "")) ? {} : [];
        }

        // Move to the next level in the structure
        current = current[k];
      }
    });
  }

  return result;
}
