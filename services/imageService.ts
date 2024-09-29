import { pathToCardsForUpload } from '@constants/path-to-cards'
import { v4 as uuid } from 'uuid'
import { writeFileSync } from 'fs'

class ImageService {
  /**
   *
   * @param image
   * @returns
   */
  base64ToString(base64: string): string {
    return base64.replace(/^data:image\/png;base64/, '')
  }

  /**
   *
   * @param {Buffer} imageBuffer
   * @param {string} filename
   * @returns {OutputInfo}
   */
  saveImage(
    decodedImage: string,
    filename: string
  ): { success: boolean; error: any } {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Method does not run in dev')
    }

    try {
      const imagePage = `${pathToCardsForUpload}${filename}`
      writeFileSync(imagePage, decodedImage, 'base64')

      return { success: true, error: null }
    } catch (error) {
      console.log('error', error)
      return { success: false, error }
    }
  }

  /**
   *
   * @returns {string}
   */
  generateFilename(): string {
    return `${uuid()}.png`
  }
}

export const imageService = new ImageService()
