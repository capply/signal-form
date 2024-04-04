type ParsedObject = { [key: string]: any };

export function parseFormData(formData: FormData): ParsedObject {
  let result: ParsedObject = {};

  // Iterate over each form data entry
  for (let [key, value] of formData) {
    let current = result;
    let keys = key.split(/[\.\[\]]/).filter((k) => k !== ""); // Split the key into parts and filter out empty strings

    keys.forEach((k, index) => {
      // Check if it's the last key
      if (index === keys.length - 1) {
        // Keys may occur multiple times in the form data, this could be the
        // case for multi-selects for example. In this case we need to convert
        // the value to an array.
        if (current.hasOwnProperty(k)) {
          // if it's already an array, append the value, otherwise convert it
          if (Array.isArray(current[k])) {
            current[k] = [...current[k], value];
          } else {
            current[k] = [current[k], value];
          }
        } else {
          current[k] = value;
        }
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
