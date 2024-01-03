import FileResizer from "react-image-file-resizer";

//optimizeImage function is designed to take an image file, resize and optimize it using the 'react-image-file-resizer' library, and then invoke a callback function with the base64-encoded URI of the resized image. This is useful for tasks such as preparing images for efficient web display
export const optimizeImage = (file: File, callback: (uri: string) => void) => {
  FileResizer.imageFileResizer(
    file, // Input image file
    700, // New width
    700, // New height
    "WEBP", // Output format (WEBP)
    100, // Quality (100 is the highest)
    0, // Rotation (0 means no rotation)
    (uri) => {
      callback(uri.toString()); // Invoke the callback with the resized image URI
    },
    "base64" // Output type (base64 encoding)
  );
};

//WEBP, a modern image format that provides good compression and quality
