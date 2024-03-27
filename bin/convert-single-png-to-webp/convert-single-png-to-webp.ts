#!/usr/bin/env node
import sharp from 'sharp'

void main()
  .then(async () => {
    console.log('Finished converting PNG to WEBP')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(2)
  })

async function main() {
  await sharp('temp/card-to-convert.png')
    .webp({ lossless: true, quality: 100 })
    .toFile('temp/converted-card.webp')
}
