import { useEffect, useRef, useState } from "react";
import "../App.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ReactComponent as Loading } from "../assets/loading.svg";
import ProgressBar from "../components/ProgressBar";
import colorPalletes from "../color-palettes";
import ReactSelect, { GroupBase } from "react-select";

type FileWithPreview = File & {
  preview: string;
};

interface PaletteOption extends GroupBase<string> {
  readonly label: string;
  readonly value: string;
  readonly palette: number[][];
}

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function GeneratorSection() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    maxSize: 10485760,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        setError("Image file is too large (Max 10MB)");
        return;
      }
      setImage(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });
  const [image, setImage] = useState<FileWithPreview | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [palette, setPallete] = useState<PaletteOption>({
    label: "2bit_demichrome",
    value: "2bit_demichrome",
    palette: colorPalletes["2bit_demichrome"],
  } as PaletteOption);
  const [pixelSize, setPixelSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  // const windowSize = useRef([window.innerWidth, window.innerHeight]);
  // const [imageListBottom, setImageListBottom] = useState<string[]>([]);
  // const [imageListTop, setImageListTop] = useState<string[]>([]);

  // useEffect(() => {
  //   const width = windowSize.current[0];
  //   const height = Math.max(windowSize.current[1], document.body.scrollHeight);
  //   const imageCount =
  //     width < 1024 ? Math.ceil(width / 96) : Math.ceil(height / 54);
  //   const colorPalletesLength = Object.keys(colorPalletes).length;

  //   if (imageListBottom.length === 0) {
  //     const randomBottomStartIndex = Math.random() * colorPalletesLength;
  //     setImageListBottom(
  //       Array(imageCount)
  //         .fill(1)
  //         .map(
  //           (_, i) =>
  //             `/shiina/${
  //               Object.keys(colorPalletes)[
  //                 (i + Math.floor(randomBottomStartIndex)) % colorPalletesLength
  //               ]
  //             }.png`
  //         )
  //     );
  //   }
  //   if (imageListTop.length === 0) {
  //     const randomTopStartIndex = Math.random() * colorPalletesLength;
  //     setImageListTop(
  //       Array(imageCount)
  //         .fill(1)
  //         .map(
  //           (_, i) =>
  //             `/shiina/${
  //               Object.keys(colorPalletes)[
  //                 (i + Math.floor(randomTopStartIndex)) % colorPalletesLength
  //               ]
  //             }.png`
  //         )
  //     );
  //   }
  // }, [windowSize.current[0], windowSize.current[1]]);

  const handleGenerate = async () => {
    if (!image) {
      setError("Please select an image");
      return;
    }

    if (pixelSize < 1) {
      setError("Pixel size must be greater than 0");
      return;
    }

    setPixelSize(Math.round(pixelSize));

    setError("");
    setIsLoading(true);
    setResult("");

    const data = new FormData();
    data.append("image", image);
    data.append("color_palette", palette.value);
    data.append("pixel_size", pixelSize.toString());

    await axios
      .post(`${backendUrl}/generate/2-bit-pixel-art`, data, {
        timeout: 30 * 1000,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total!) * 50
          );
          setProgressValue(progress);
        },
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total!) * 50 + 50
          );
          setProgressValue(progress);
        },
      })
      .then((res) => res.data)
      .then((responseData: { result_url: string }) => {
        setResult(`${backendUrl}/${responseData.result_url}`);
      })
      .catch((err) => {
        if (err.code === "ECONNABORTED") {
          setError("Request timeout");
        } else if (err.request.status === 400) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong");
        }
      });
    setIsLoading(false);
    setProgressValue(0);
  };

  const handlePixelSizeChange = (e: any) => {
    setPixelSize(parseInt(e.target.value) || 1);
  };

  return (
    <section
      id="generator-section"
      className="bg-indigo-950 py-8 flex lg:flex-row justify-between flex-col"
    >
      {/* <div className="flex overflow-hidden justify-center lg:flex-col">
        {imageListTop.map((image) => (
          <img src={image} alt="random-sample" className="w-24" />
        ))}
      </div> */}
      <div className="min-h-screen pt-2 text-white pb-4 px-4 flex-1">
        <div className="max-w-[900px] h-full mx-auto">
          <h2 className="text-2xl text-center py-4 font-bold">Generator</h2>
          <p className="text-center">Input</p>
          <div
            className="w-full max-w-[900px] max-h-[800px] border border-white flex justify-center items-center md:h-[50vh] h-[30vh] m-auto rounded bg-slate-900 hover:bg-slate-950 hover:cursor-pointer"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="h-full w-full flex">
              {!image ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full m-auto">
                  <p>Drop image here</p>
                  <p>or</p>
                  <button className="border px-4 py-2 rounded">
                    Click here to select image
                  </button>
                  <p className="text-center">
                    (Maximum file size is 10MB and maximum resolution is ~4K)
                  </p>
                </div>
              ) : (
                <img
                  className="object-cover max-h-full max-w-full m-auto"
                  src={image.preview}
                  alt="preview"
                  onLoad={() => URL.revokeObjectURL(image.preview)}
                />
              )}
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-center mt-8 gap-2 mb-2">
            <div className="flex md:flex-row flex-col items-center">
              <label className="mx-2">Pixel size:</label>
              <input
                maxLength={4}
                pattern="[0-9]*"
                className="text-black w-16 px-1 h-9 rounded border focus:border-blue-300"
                placeholder="4"
                value={pixelSize}
                onChange={handlePixelSizeChange}
              />
            </div>
            <div className="flex items-center flex-col md:flex-row">
              <label className="mx-2">Color pallete:</label>
              <ReactSelect
                className="w-64"
                value={palette}
                onChange={(e) => {
                  setPallete(e as PaletteOption);
                }}
                options={
                  Object.keys(colorPalletes).map((palette) => {
                    return {
                      label: palette,
                      value: palette,
                      palette: colorPalletes[palette],
                    };
                  }) as PaletteOption[]
                }
                formatOptionLabel={(palette: PaletteOption) => {
                  return (
                    <div className="text-black flex items-center justify-between">
                      <p>{palette.label}</p>
                      <div className="flex flex-row">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            className="w-4 h-4"
                            style={{
                              backgroundColor: `rgb(${palette.palette[i][0]}, ${palette.palette[i][1]}, ${palette.palette[i][2]})`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            <button
              className={
                "border px-4 py-2 rounded bg-slate-900 hover:bg-slate-950 mx-4 my-4" +
                (isLoading ? " cursor-not-allowed" : "")
              }
              onClick={handleGenerate}
              disabled={isLoading}
            >
              Generate
            </button>
          </div>
          {progressValue > 0 && (
            <div className="mb-4">
              <ProgressBar progressValue={progressValue} />
              <p className="text-center">
                {progressValue < 50 ? "Uploading..." : "Processing..."}
              </p>
            </div>
          )}
          <div className="mb-4">
            {error && <p className="text-rose-500 text-center">{error}</p>}
          </div>
          <p className="text-center">Result</p>
          <div className="w-full max-w-[900px] max-h-[800px] border border-white flex justify-center items-center md:h-[50vh] h-[30vh] m-auto rounded bg-slate-900 ">
            <div className="h-full w-full flex">
              {!result ? (
                <div className="flex flex-col items-center justify-center gap-2 h-full m-auto">
                  {isLoading && (
                    <div className="flex flex-row items-center">
                      <Loading />
                      <p>Loading...</p>
                    </div>
                  )}
                  <p>Result will be shown here</p>
                </div>
              ) : (
                <img
                  className="object-cover max-h-full max-w-full m-auto"
                  src={`${result}`}
                  alt="result"
                />
              )}
            </div>
          </div>
          {result && (
            <p className="text-center">
              Result will be deleted from server after {">"}5 minutes
            </p>
          )}
          <button
            className={
              "border px-4 py-2 rounded bg-slate-900 hover:bg-slate-950 text-center m-auto block my-4" +
              (isLoading || !result ? " cursor-not-allowed" : "")
            }
            disabled={!result}
            onClick={() => {
              window.open(`${result}`);
            }}
          >
            Open Result
          </button>
        </div>
      </div>
      {/* <div className="flex overflow-hidden justify-center lg:flex-col">
        {imageListBottom.map((image) => (
          <img src={image} alt="random-sample" className="w-24" />
        ))}
      </div> */}
    </section>
  );
}

export default GeneratorSection;
