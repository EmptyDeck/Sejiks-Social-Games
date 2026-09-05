// progress.js
let fileHandle = null;

/**
 * Ensure permission to read/write the file
 */
async function ensurePermission(handle, mode = "readwrite") {
  const query = await handle.queryPermission({ mode });
  if (query === "granted") return true;
  const request = await handle.requestPermission({ mode });
  return request === "granted";
}

/**
 * Open a JSON progress file and load it
 */
export async function openProgressFile() {
  try {
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [
        { description: "Progress JSON", accept: { "application/json": [".json"] } }
      ]
    });

    if (!(await ensurePermission(handle, "readwrite"))) {
      throw new Error("권한 거부됨");
    }

    const file = await handle.getFile();
    const text = await file.text();
    const data = JSON.parse(text);

    fileHandle = handle;
    return data;
  } catch (err) {
    console.error("openProgressFile error:", err);
    return null;
  }
}

/**
 * Save progress JSON to the currently opened file
 */
export async function saveProgress(data) {
  if (!fileHandle) {
    console.warn("No file handle — use saveProgressAs() first");
    return;
  }
  await writeToFile(fileHandle, data);
}

/**
 * Save progress JSON with "Save As"
 */
export async function saveProgressAs(data, suggestedName = "progress.json") {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        { description: "Progress JSON", accept: { "application/json": [".json"] } }
      ]
    });
    await writeToFile(handle, data);
    fileHandle = handle;
  } catch (err) {
    console.error("saveProgressAs error:", err);
  }
}

/**
 * Internal helper to write JSON data
 */
async function writeToFile(handle, data) {
  if (!(await ensurePermission(handle, "readwrite"))) {
    throw new Error("권한 거부됨");
  }
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
  console.log("저장됨:", handle.name);
}
