import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageConfigs {
  async saveBase64Image(base64Data: string) {
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
    const convertStringToByte = Buffer.from(matches![2], 'base64');
    const imageType = matches![1];

    const resizeImg = await sharp(convertStringToByte).resize(300).toBuffer();

    const reziedImage = resizeImg.toString('base64');
    const resizedBase64 = `data:image/${imageType};base64,${reziedImage}`;

    return resizedBase64;
  }
}
