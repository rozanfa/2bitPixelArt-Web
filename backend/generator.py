import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
import argparse

def euclidian_distance(a, b):
    return np.linalg.norm(a - b)

def twobit_pixel_art(image: np.ndarray, pixel_size: int, color_palette: np.ndarray) -> np.ndarray:
    """
    Returns a 2-bit pixel art image from the given image and pixel size.

    Parameters
    ----------
    image : np.ndarray
        The image to convert to pixel art.
    pixel_size : int
        The size of each pixel in the pixel art.
    color_palette : np.ndarray
        The color palette to use for the pixel art.
        Supported color palettes are:
        2bit_demichrome, bicycle, neon_night_sky, red-blood_pain, 2_bit_matrix, b4sement, pumpkin_gb, honey_milk, mangavania, daybreak, sunset_lattern, hexpress4

    Returns
    -------
    np.ndarray
        The pixel art image.
    """
    # Handle monochrome images
    if image.ndim == 2:
        image = np.stack((image,)*3, axis=-1)

    # Convert image to RGB if it is RGBA
    if image.shape[2] > 3:
        image = image[:, :, :3]

    # Convert to Uint8 Image
    image = image * 255

    # Convert to 1D array
    (x, y, z) = image.shape
    image = image.reshape(-1, 3)

    # K-Means Clustering
    kmeans_model = KMeans(n_clusters = 4, n_init='auto')
    cluster_labels = kmeans_model.fit_predict(image)
    rgb_cols = kmeans_model.cluster_centers_.round(0).astype(int)
    sorted_rgb_cols = sorted(rgb_cols, key=lambda c: euclidian_distance(c, np.array([0,0,0])), reverse=True)
   
    # Pixelate the image using mode pooling
    pixelated_cluster_labels = cluster_labels.copy().reshape(x, y)
    for i in range(x//pixel_size+1):
        for j in range (y//pixel_size+1):
            if i*pixel_size >= x or j*pixel_size >= y:
                continue
            label = np.bincount(
                pixelated_cluster_labels[
                    i*pixel_size:(i+1)*pixel_size,
                    j*pixel_size:(j+1)*pixel_size
                ].flatten()).argmax()
            pixelated_cluster_labels[
                i*pixel_size:(i+1)*pixel_size,
                j*pixel_size:(j+1)*pixel_size
            ] = label

    # Get the index of the sorted colors
    idx_not_sorted_to_sorted = []
    for i in range(len(rgb_cols)):
        idx_not_sorted_to_sorted.append(
            np.where(np.all(
                sorted_rgb_cols == rgb_cols[i], axis=1
                ))[0][0])

    # Map the sorted colors to the palette
    idx_sorted_to_palette = []
    temp_color_palete = color_palette.copy()
    for i in range(len(color_palette)):
        idx_sorted_to_palette.append(
            sorted(
                temp_color_palete,
                key=lambda c: euclidian_distance(
                    c, sorted_rgb_cols[i]
                ),
            )[0])
        temp_color_palete = [
            c for c in temp_color_palete if 
            not np.array_equal(c, idx_sorted_to_palette[i])
        ]
    
    # Convert to numpy arrays
    idx_not_sorted_to_sorted = np.array(idx_not_sorted_to_sorted)
    idx_sorted_to_palette = np.array(idx_sorted_to_palette)

    # Apply mapping to the pixelated image
    pixelart_img = idx_sorted_to_palette[idx_not_sorted_to_sorted[pixelated_cluster_labels]].astype(np.uint8)
    return pixelart_img


color_palettes = {
    "2bit_demichrome" : np.array([
        [33, 30, 32],
        [85, 85, 104],
        [160, 160, 139],
        [233, 239, 236]
    ]),
    "bicycle": np.array([
        [22, 22, 22],
        [171, 70, 70],
        [143, 155, 246],
        [240, 240, 240]
    ]),
    "neon_night_sky": np.array([
        [19, 22, 38],
        [76, 76, 127],
        [230, 161, 207],
        [255, 230, 234]
    ]),
    "red-blood_pain": np.array([
        [126, 31, 35],
        [196, 24, 31],
        [18, 10, 25],
        [94, 64, 105]
    ]),
    "2_bit_matrix": np.array([
        [242, 255, 242],
        [173, 217, 188],
        [91, 140, 124],
        [13, 26, 26]
    ]),
    "b4sement": np.array([
        [34, 35, 35],
        [255, 74, 220],
        [61, 255, 152],
        [240, 246, 240]
    ]),
    "pumpkin_gb": np.array([
        [20, 43, 35],
        [25, 105, 44],
        [224, 110, 22],
        [247, 219, 126]
    ]),
    "honey_milk": np.array([
        [33, 18, 16],
        [94, 45, 32],
        [199, 107, 42],
        [240, 194, 96]
    ]),
    "mangavania": np.array([
        [176, 62, 128],
        [255, 138, 205],
        [74, 237, 255],
        [255, 255, 255]
    ]),
    "daybreak": np.array([
        [8, 5, 12],
        [130, 45, 48],
        [235, 117, 77],
        [248, 181, 129]
    ]),
    "sunset_lattern": np.array([
        [82, 50, 55],
        [171, 100, 90],
        [227, 155, 127],
        [249, 205, 166]
    ]),
    "morning_mist": np.array([
        [10, 10, 36],
        [107, 99, 99],
        [167, 186, 145],
        [192, 239, 251]
    ]),
    "hexpress4": np.array([
        [85, 56, 64],
        [155, 104, 89],
        [190, 188, 106],
        [237, 248, 200]
    ]),
    "enamored": np.array([
        [248, 243, 253],
        [250, 198, 180],
        [218, 41, 142],
        [46, 43, 18]
    ]),
    "voltage_warning": np.array([
        [28, 20, 18],
        [99, 86, 80],
        [211, 174, 33],
        [212, 201, 195]
    ]),
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate 2-bit pixel art from an image.\nSupported color palettes are: 2bit_demichrome, bicycle, neon_night_sky, red-blood_pain, 2_bit_matrix, b4sement, pumpkin_gb, honey_milk, mangavania, daybreak, sunset_lattern, hexpress4')
    parser.add_argument('image_path', type=str, help='Path to the image')
    parser.add_argument('pixel_size', type=int, help='Size of each pixel')
    parser.add_argument('color_palette', type=str, help='Color palette to use')
    parser.add_argument('--save', type=str, help='Path to save the image')
    args = parser.parse_args()

    image = plt.imread(args.image_path)
    pixel_size = args.pixel_size
    color_palette = color_palettes[args.color_palette]
    pixelart_img = twobit_pixel_art(image, pixel_size, color_palette)
    plt.imshow(pixelart_img)
    plt.show()
    if args.save:
        plt.imsave(args.save, pixelart_img)
