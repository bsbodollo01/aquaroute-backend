import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("AquaRoute API is working!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
