import { Injectable } from '@nestjs/common';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileStorageService {
  constructor() {
    // Specify the return type as MulterOptions
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = `./uploads`; // Create separate folders for each file type
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    };
  }
}

// @Injectable()
// export class FileStorageService {
//   configureStorage(): MulterOptions {
//     // Specify the return type as MulterOptions
//     return {
//       storage: diskStorage({
//         destination: (req, file, cb) => {
//           const uploadPath = `./uploads/${file.fieldname}s`; // Create separate folders for each file type
//           cb(null, uploadPath);
//         },
//         filename: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           cb(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//     };
//   }
// }
