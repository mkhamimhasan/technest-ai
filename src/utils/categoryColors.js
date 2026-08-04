// Same gradient palette the site always used for category cards.
// Firestore categories don't store a color, so we cycle through this
// list by index — keeps the exact visual style, no design change.
const PALETTE = [
  "from-purple-500 to-purple-700",
  "from-cyan-500 to-cyan-700",
  "from-blue-500 to-blue-700",
  "from-yellow-500 to-yellow-700",
  "from-red-500 to-red-700",
  "from-green-500 to-green-700",
  "from-pink-500 to-pink-700",
  "from-indigo-500 to-indigo-700",
];

export function colorForIndex(i) {
  return PALETTE[i % PALETTE.length];
}

export default PALETTE;
