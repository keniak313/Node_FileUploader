import cloudinary from "cloudinary";
import multer from "multer";
import fs from "graceful-fs";

const uploadImage = async (imagePath, userId, name) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    asset_folder: userId,
    display_name: name,
  };
  try {
    const result = await cloudinary.v2.uploader.upload(imagePath, options);
    //console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const getAssetInto = async (publicId) => {
  const options = {
    colors: true,
  };

  try {
    const result = await cloudinary.v2.api.resource(publicId, options);
    //console.log(result)
    return result.colors;
  } catch (err) {
    console.log(err);
  }
};

export const createThumbnail = (publicId, ...colors) => {
  // Set the effect color and background color
  const [effectColor, backgroundColor] = colors;

  // Create an image tag with transformations applied to the src URL
  let imageTag = cloudinary.image(publicId, {
    transformation: [
      { width: 250, height: 250, crop: "thumb" },
      { radius: "max" },
      { effect: "outline:10", color: effectColor },
      { background: backgroundColor },
    ],
  });

  return imageTag;
};

export const updateAsset = async (publicId, name, func) =>{
  await cloudinary.v2.api.update(publicId, {display_name: name}).then(await func)
}

export const removeAsset = async (publicId, func) => {
  await cloudinary.v2.api.delete_resources(publicId).then(await func);
};

export const getAllResources = async() =>{
  const res = await cloudinary.v2.api.resources()
  console.log(res)
}

//Multer

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./public/data/uploads/${req.user.id}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const memStorage = multer.memoryStorage();

export const upload = multer({ storage: memStorage });

const myUploadMiddleware = upload.single("uploaded_file");

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const uploadHandler = async (req, res) => {
  try {
    await runMiddleware(req, res, myUploadMiddleware);
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    console.log("Buffer");
    console.log(dataURI);
    const cldRes = await uploadImage(
      dataURI,
      req.user.id,
      req.file.originalname,
    );
    return cldRes;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export default uploadHandler;
