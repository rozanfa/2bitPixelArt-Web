function IntroSection() {
  const handleClickScroll = (section: string) => {
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-[1000px] mx-auto md:p-16 p-8 h-screen flex flex-col justify-between border-b min-h-[700px]">
      <div>
        <h1 className="text-center font-bold text-4xl">
          2-Bit Pixel Art Generator
        </h1>
        <p className="text-center text-xl mt-4">
          Convert an image to 2-bit pixel art!
        </p>
      </div>
      <div className="flex w-full justify-center items-center gap-4 my-20">
        <img
          className="md:w-[40vw] w-[35vw] max-w-[450px] h-auto"
          src="/shiina/original.png"
        />
        <img className="md:h-10 h-6 invert" src="/img/right-arrow.png" />
        <div>
          <img
            className="md:w-[40vw] w-[35vw] max-w-[450px] h-auto"
            src="/shiina/mangavania.png"
          />
          <div className="md:w-[40vw] w-[35vw] max-w-[450px] text-center absolute md:text-base text-sm">
            Color Palette: mangavania
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center flex-col md:flex-row gap-x-8">
        <button
          onClick={() => handleClickScroll("about-section")}
          className={
            "border px-4 py-2 rounded bg-slate-900 hover:bg-slate-950 my-4"
          }
        >
          About
        </button>
        <button
          onClick={() => handleClickScroll("color-palettes-section")}
          className={
            "border px-4 py-2 rounded bg-slate-900 hover:bg-slate-950 my-4"
          }
        >
          Color Palettes
        </button>
        <button
          onClick={() => handleClickScroll("generator-section")}
          className={
            "border px-4 py-2 rounded bg-indigo-900 hover:bg-indigo-950 my-4"
          }
        >
          Try Now!
        </button>
      </div>
    </section>
  );
}

export default IntroSection;
