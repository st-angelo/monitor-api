import streamifier from 'streamifier';
import cloudinary from '../utils/cloundinary';

export const uploadAvatar = (file: Express.Multer.File) => {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'monitor/avatars',
      },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
