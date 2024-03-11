import sharp, { type OutputInfo } from 'sharp'
import { pathToCardsForUpload } from '@constants/path-to-cards'

class ImageService {
  async convertToWebp(image: string): Promise<Buffer> {
    return await sharp(image).webp().toBuffer()
  }

  async saveImage(imageBuffer: Buffer, filename: string): Promise<OutputInfo> {
    return await sharp(imageBuffer).toFile(`${pathToCardsForUpload}${filename}`)
  }
}

export const imageService = new ImageService()
