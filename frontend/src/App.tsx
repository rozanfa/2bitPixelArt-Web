import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ReactComponent as Loading } from "./loading.svg";
import ProgressBar from "./components/ProgressBar";
import colorPalletes from "./color-palettes";
import GeneratorSection from "./sections/GeneratorSection";
import IntroSection from "./sections/IntroSection";
import FooterSection from "./sections/FooterSection";
import AboutSection from "./sections/AboutSection";
import ColorPalletesSection from "./sections/ColorPalettesSection";

function App() {
  return (
    <div>
      <div className="upper-section text-white">
        <IntroSection />
        <AboutSection />
        <ColorPalletesSection />
      </div>
      <GeneratorSection />
      <FooterSection />
    </div>
  );
}

export default App;
