import sharp, { type OutputInfo } from 'sharp'
import { pathToCardsForUpload } from '@constants/path-to-cards'
import { v4 as uuid } from 'uuid'

class ImageService {
  /**
   *
   * @param {string} image
   * @returns {Buffer}
   */
  async convertToWebp(image: ArrayBuffer | Buffer | string): Promise<Buffer> {
    return await sharp(image).webp().toBuffer()
  }

  /**
   *
   * @param {Buffer} imageBuffer
   * @param {string} filename
   * @returns {OutputInfo}
   */
  async saveImage(imageBuffer: Buffer, filename: string): Promise<OutputInfo> {
    return await sharp(imageBuffer).toFile(`${pathToCardsForUpload}${filename}`)
  }

  /**
   *
   * @returns {string}
   */
  generateFilename(): string {
    return `${uuid()}.webp`
  }
}

export const imageService = new ImageService()
