from PIL import Image
import os

def resize_image(input_path, size=(1280, 800)):
    if os.path.exists(input_path):
        try:
            with Image.open(input_path) as img:
                # Resize image using high-quality resampling
                img_resized = img.resize(size, Image.Resampling.LANCZOS)
                # Overwrite original or save as a new file, here we use original suffix but maybe we should just overwrite or append `_resized`
                # I will overwrite it for simplicity or write to a new file to be safe. Let's write to a new file so we don't destroy the originals.
                output_path = f"resized_{input_path}"
                img_resized.save(output_path)
                print(f"Successfully resized '{input_path}' to {size[0]}x{size[1]} and saved as '{output_path}'")
        except Exception as e:
            print(f"Error processing '{input_path}': {e}")
    else:
        print(f"File not found: '{input_path}'")

if __name__ == "__main__":
    # List of files to process
    files_to_resize = ["screenshot1.jpg", "screenshot2.jpg"]
    
    for filename in files_to_resize:
        resize_image(filename)
