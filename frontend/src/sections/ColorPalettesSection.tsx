import colorPalletes from "../color-palettes";

function ColorPalletesSection() {
  return (
    <section
      id="color-palettes-section"
      className="w-full max-w-[1080px] mx-auto p-16 h-auto"
    >
      <h2 className="text-2xl text-center py-4 font-bold mb-4">
        Color Palettes
      </h2>

      <p>
        I use the 2-bit color palettes from{" "}
        <a
          className="hover:underline hover:text-blue-400"
          href="https://lospec.com/palette-list/tag/2bit"
        >
          Locspec
        </a>
        . The color palettes are listed below.
      </p>
      <div className="flex flex-row flex-wrap sm:gap-10 gap-2 mx-auto w-full justify-center mt-8">
        {Object.keys(colorPalletes).map((name) => {
          return (
            <div className="w-60 md:w-72 border border-white p-2 rounded">
              <div className="flex justify-between items-center mb-4">
                <p>{name}</p>
                <div className="flex flex-row">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      className="w-4 h-4"
                      style={{
                        backgroundColor: `rgb(${colorPalletes[name][i][0]}, ${colorPalletes[name][i][1]}, ${colorPalletes[name][i][2]})`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              <img className="h-30 mx-auto" src={`/shiina/${name}.png`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ColorPalletesSection;
