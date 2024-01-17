import { useEffect, useRef, useState } from "react";
import "../App.css";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ReactComponent as Loading } from "../assets/loading.svg";
import ProgressBar from "../components/ProgressBar";
import colorPalletes from "../color-palettes";
import ReactSelect, { GroupBase } from "react-select";

function FooterSection() {
  return (
    <footer className="w-full text-center bg-black text-white">
      <p className="">
        Developed by{" "}
        <a
          className="hover:underline hover:text-blue-400"
          href="http://rozanfa.codes"
        >
          Rozan Fadhil Al Hafidz
        </a>{" "}
      </p>
      <a
        className="text-xs"
        href="https://www.flaticon.com/free-icons/arrow"
        title="arrow icons"
      >
        Arrow icons created by Freepik - Flaticon
      </a>
      {" | "}
      <a
        className="text-xs"
        href="https://myanimelist.net/anime/50739/Otonari_no_Tenshi-sama_ni_Itsunomanika_Dame_Ningen_ni_Sareteita_Ken"
        title="arrow icons"
      >
        Example image taken from The Angel Next Door Spoils Me Rotten
      </a>
    </footer>
  );
}

export default FooterSection;
