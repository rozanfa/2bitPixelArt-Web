import { useRef, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ReactComponent as Loading } from "./loading.svg";
import ProgressBar from "./ProgressBar";
import colorPalletes from "./color-palettes";

type FileWithPreview = File & {
  preview: string;
};

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function App() {
  const { getRootProps, getInputProps, open } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      setImage(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
      );
    },
  });
  const [image, setImage] = useState<FileWithPreview | null>(null);
  const [showError, setShowError] = useState(false);
  const [result, setResult] = useState("");
  const [palette, setPallete] = useState("2bit_demichrome");
  const [pixelSize, setPixelSize] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  const handlePalleteChange = (e: any) => {
    setPallete(e.target.value);
  };

  const handleGenerate = async () => {
    if (!image) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setIsLoading(true);
    setResult("");

    const data = new FormData();
    data.append("image", image);
    console.log(image);
    data.append("color_palette", palette);
    data.append("pixel_size", pixelSize.toString());

    await axios
      .post(`${backendUrl}/generate/2-bit-pixel-art`, data, {
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
      .then((responseData) => {
        console.log(responseData);
        setResult(`${backendUrl}/${responseData}`);
      });
    setIsLoading(false);
    setProgressValue(0);
  };

  const handlePixelSizeChange = (e: any) => {
    let value = e.target.value;
    value = Math.round(value);
    if (value < 1) {
      value = 1;
    }
    setPixelSize(value);
  };

  return (
    <div className="bg-indigo-950">
      <div className="flex overflow-hidden justify-center">
        {Array(Math.ceil(windowSize.current[0] / 96))
          .fill(1)
          .map((_) => (
            <img
              src={`/shiina/${
                Object.keys(colorPalletes)[
                  Math.floor(Math.random() * Object.keys(colorPalletes).length)
                ]
              }.png`}
              alt="random-sample"
              className="w-24"
            />
          ))}
      </div>
      <div className="min-h-screen pt-2 text-white pb-4 px-4">
        <div className="max-w-[1000px] h-full mx-auto">
          <p className="text-xl text-center py-4 font-bold">
            2-bit Pixel Art Generator
          </p>
          <p className="text-center">Input</p>
          <div
            className="w-full max-w-[1000px] max-h-[800px] border border-white flex justify-center items-center md:h-[50vh] h-[30vh] m-auto rounded bg-slate-900 hover:bg-slate-950 hover:cursor-pointer"
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
          {showError && (
            <p className="text-rose-500 text-center">
              Please upload an image first
            </p>
          )}
          <div className="w-full flex flex-col md:flex-row items-center justify-center mt-8 mb-4 gap-2">
            <div>
              <label className="mx-2">Pixel size:</label>
              <input
                type="number"
                className="text-black w-16 px-1"
                placeholder="4"
                value={pixelSize}
                onChange={handlePixelSizeChange}
              />
            </div>
            <div>
              <label className="mx-2">Color pallete:</label>
              <select
                onChange={handlePalleteChange}
                value={palette}
                className="text-black"
              >
                {Object.keys(colorPalletes).map((pallete) => (
                  <option value={pallete} key={pallete}>
                    {pallete}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row mx-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor: `rgb(${colorPalletes[palette][i][0]}, ${colorPalletes[palette][i][1]}, ${colorPalletes[palette][i][2]})`,
                  }}
                ></div>
              ))}
            </div>
            <button
              className={
                "border px-4 py-2 rounded bg-slate-900 hover:bg-slate-950 mx-2" +
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
          <p className="text-center">Result</p>
          <div className="w-full max-w-[1000px] max-h-[800px] border border-white flex justify-center items-center md:h-[50vh] h-[30vh] m-auto rounded bg-slate-900 ">
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
              Result will be deleted from server after ~5 minutes
            </p>
          )}
          <button
            className={
              "border px-4 py-2 rounded hover:bg-slate-900 text-center m-auto block my-4"
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
      <div className="flex overflow-hidden justify-center">
        {Array(Math.ceil(windowSize.current[0] / 96))
          .fill(1)
          .map((_) => (
            <img
              src={`/shiina/${
                Object.keys(colorPalletes)[
                  Math.floor(Math.random() * Object.keys(colorPalletes).length)
                ]
              }.png`}
              alt="random-sample"
              className="w-24"
            />
          ))}
      </div>
    </div>
  );
}

export default App;
