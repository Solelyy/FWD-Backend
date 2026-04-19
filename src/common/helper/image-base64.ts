import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ImageConfigs {
  async saveBase64Image(base64Data: string): Promise<string> {
    // Extract the base64 data (remove the "data:image/png;base64," prefix)
    const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);

    if (!matches) {
      throw new BadRequestException('Invalid image format');
    }

    const extension = matches[1]; // png, jpeg, etc.
    const base64String = matches[2];
    const buffer = Buffer.from(base64String, 'base64');

    // Generate filename
    const filename = `image-${Date.now()}.${extension}`;
    const filepath = `./src/uploads/attendance/${filename}`;

    // Save file
    const fs = require('fs').promises;
    await fs.writeFile(filepath, buffer);

    return `/uploads/attendance/${filename}`;
  }
}
