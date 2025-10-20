import CarouselCircle from "./lib/CarouselCircle";
import { useState, useCallback } from "react";

import Placeholder from "./assets/img/city.jpg?as=meta:height;width";
import Placeholder2 from "./assets/img/bord-de-mer-cote-faire-signe-idyllique-1835718.jpg?as=meta:height;width";
import Placeholder3 from "./assets/img/coverBlue_weekend.jpg?as=meta:height;width";
import Placeholder4 from "./assets/img/cover_heligoland.jpg?as=meta:height;width";

import "./App.css";

function App() {
  const img = import.meta.glob("./assets/img/*.jpg");
  const sizeHolder = [Placeholder, Placeholder2, Placeholder3, Placeholder4];
  const urlArr = [
    ...Object.keys(img).map((elem, i) => {
      return {
        src: elem.replace(".","/src"),
        width: sizeHolder[i].width,
        height: sizeHolder[i].height,
      };
    }),
  ];
  const [current, setCurrent] = useState(0);
  const [dim, setDim] = useState(500);

  const handleClick = useCallback((num:number) => {
    console.log(num);
    
    setCurrent(num)
  },[])

  return (
    <>
      <main className="w-screen h-screen flex justify-center items-center flex-col">
        <CarouselCircle urlArr={urlArr} currentImg={current} dim={dim} />
        <div className="mt-8 space-x-1">
          {urlArr.map((elem,i) => {return (
            <button onClick={() => handleClick(i)} className="bg-linear-to-r from-slate-300 to-slate-400" key={i}>{i}</button>
          )})}
        </div>
      </main>
    </>
  );
}

export default App;
