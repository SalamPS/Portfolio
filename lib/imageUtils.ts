// Image compression utility functions

interface CompressOptions {
  maxSizeKB?: number // Maximum file size in KB (default: 500KB)
  maxWidth?: number // Maximum width in pixels (default: 1920)
  maxHeight?: number // Maximum height in pixels (default: 1080)
  quality?: number // JPEG quality 0-1 (default: 0.8)
  format?: 'jpeg' | 'webp' | 'png' // Output format (default: 'jpeg')
}

export const compressImage = async (
  file: File, 
  options: CompressOptions = {}
): Promise<File> => {
  const {
    maxSizeKB = 500,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg'
  } = options

  // Check if compression is needed
  const fileSizeKB = file.size / 1024
  if (fileSizeKB <= maxSizeKB) {
    console.log(`Image size (${Math.round(fileSizeKB)}KB) is within limit (${maxSizeKB}KB), no compression needed`)
    return file
  }

  console.log(`Compressing image: ${Math.round(fileSizeKB)}KB → target: ${maxSizeKB}KB`)

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img
      const aspectRatio = width / height

      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      // Set canvas dimensions
      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, width, height)

      // Convert to blob with specified quality and format
      const mimeType = `image/${format}`
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'))
            return
          }

          const compressedSizeKB = blob.size / 1024
          console.log(`Image compressed: ${Math.round(fileSizeKB)}KB → ${Math.round(compressedSizeKB)}KB`)

          // Create new file with compressed blob
          const compressedFile = new File(
            [blob], 
            file.name.replace(/\.[^/.]+$/, `.${format}`), // Change extension to match format
            { 
              type: mimeType,
              lastModified: Date.now()
            }
          )

          resolve(compressedFile)
        },
        mimeType,
        quality
      )
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'))
    }

    // Create object URL from file and load into image
    img.src = URL.createObjectURL(file)
  })
}

// Progressive compression - try different quality levels until target size is reached
export const progressiveCompress = async (
  file: File,
  options: CompressOptions = {}
): Promise<File> => {
  const { maxSizeKB = 500 } = options
  
  let currentFile = file
  let currentQuality = 0.9
  const minQuality = 0.3
  const qualityStep = 0.1

  // First try with standard compression
  currentFile = await compressImage(file, { ...options, quality: currentQuality })
  
  // If still too large, progressively reduce quality
  while (currentFile.size / 1024 > maxSizeKB && currentQuality > minQuality) {
    currentQuality -= qualityStep
    console.log(`Trying quality: ${currentQuality}`)
    
    currentFile = await compressImage(file, { 
      ...options, 
      quality: currentQuality,
      format: 'jpeg' // Force JPEG for smaller files
    })
  }

  const finalSizeKB = currentFile.size / 1024
  const originalSizeKB = file.size / 1024
  
  console.log(`Final compression result: ${Math.round(originalSizeKB)}KB → ${Math.round(finalSizeKB)}KB (${Math.round((1 - finalSizeKB/originalSizeKB) * 100)}% reduction)`)
  
  return currentFile
}

// Check if file is an image
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

// Get image dimensions
export const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
