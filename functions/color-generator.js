module.exports = colorGenerator = () => {
  const chars = "0123456789abcdef";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * 16);
    let randomChar = chars[randomIndex];
    color += randomChar;
  }
  return color;
};
