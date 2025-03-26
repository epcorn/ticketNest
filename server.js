import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongoose.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import rootRouter from "./routes/index.js";
import cloudinary from "./config/cloudinary.js";
import fileUpload from "express-fileupload";
import fs from "fs";

connectDB();

const app = express();

//Root Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/v1", rootRouter);

app.post("/api/v1/upload", async function (req, res, next) {
  try {
    let imageLinks = "";
    if (req.files) {
      let images = [];
      if (req.files.images.length > 0) images = req.files.images;
      else images.push(req.files.images);

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            use_filename: true,
            folder: "ticketNest",
            quality: 50,
            resource_type: "auto",
          }
        );
        imageLinks = result.secure_url;
        fs.unlinkSync(images[i].tempFilePath);
      }
      return res
        .status(200)
        .json({ message: "Image uploaded Successfully!", link: imageLinks });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "/client/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at port: ${port}`));
