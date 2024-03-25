function AboutSection() {
  return (
    <section
      id="about-section"
      className="w-full max-w-[1080px] mx-auto md:px-16 px-8 pt-8 pb-16 h-auto border-b"
    >
      <h2 className="text-2xl text-center py-4 font-bold mb-4">About</h2>
      <p>
        Developed by{" "}
        <a
          className="hover:underline hover:text-blue-400"
          href="http://rozanfa.codes"
        >
          Rozan Fadhil Al Hafidz
        </a>{" "}
      </p>
      <br />
      <p>
        This is my personal project based on my image processing coursework at
        Institut Teknologi Bandung. The written report can be found{" "}
        <a
          className="hover:underline hover:text-blue-400"
          href="https://informatika.stei.itb.ac.id/~rinaldi.munir/Citra/2023-2024/Makalah2023/Makalah-IF4073-Citra-2023%20(5).pdf"
        >
          here
        </a>{" "}
        (in Indonesian). The source code of algorithm can be found{" "}
        <a
          className="hover:underline hover:text-blue-400"
          href="https://github.com/rozanfa/2bit-pixel-art-generator"
        >
          here
        </a>
        .
      </p>
    </section>
  );
}

export default AboutSection;
