function generateRxNumber() {
  const length = 8; // You can adjust the length of the Rx number as needed
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rxNumber = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    rxNumber += characters[randomIndex];
  }

  return rxNumber;
}

module.exports = { generateRxNumber };
