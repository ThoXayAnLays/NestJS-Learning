import { diskStorage } from "multer";

export const storageCongif = (folder:string) => diskStorage({
    destination: `uploads/${folder}`,
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})