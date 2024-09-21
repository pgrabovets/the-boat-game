export function generateDataArray(size = 0) {
  const data = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(3);
    }
    data.push(row);
  }
  return data;
}
