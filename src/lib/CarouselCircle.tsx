import { animate, createScope } from "animejs";
import { useState, useMemo, useEffect, useRef } from "react";

export default function CarouselCircle({
  urlArr,
  currentImg,
  dim,
  key = 0,
}: {
  urlArr: { src: string; height: number; width: number }[];
  currentImg: number;
  dim: number;
  key?: number;
}) {

  const imgNaturalSize = (src: string) => {
    const img = document.createElement("img")
    img.src = src
    return {width:img.naturalWidth,height:img.naturalHeight}
  };

  const calcWidth = (dimImg: { height: number; width: number }) => {
    const rapport = dimImg.width / dimImg.height;
    return { rapport, newWidth: dimImg.width / (dimImg.width / dim / rapport) };
  };

  const [sizeSvg, setSizeSvg] = useState({ width: 0, height: 0 });
  const [radial, setRadial] = useState({ offset1: 100, offset: 200 });
  const [backImg, setBackImg] = useState(0);
  const [frontImg, setFrontImg] = useState(0);
  const [sense, setSense] = useState(false);
  const [previouse, setPrevious] = useState<"back" | "front" | null>(null);
  const [activ, setActiv] = useState(false);
  //   const [wScreen, setWScreen] = useState(0);
  //const wScreen = useRef(window.innerWidth);

  const svgCircle = useRef<null | SVGSVGElement>(null);
  const root = useRef<null | HTMLDivElement>(null)
  const scope = useRef<any>(null)

  const { rapport, newWidth } = useMemo(
    () => calcWidth(urlArr[currentImg]),
    [currentImg]
  );

  const [lastRapport, setLastRapport] = useState({ rapport, newWidth });

  const durationAnime = { minTime: 600, maxTime: 800 };

  useEffect(() => {
    if (svgCircle.current)
      setSizeSvg({
        width: svgCircle.current.clientWidth,
        height: svgCircle.current.clientHeight,
      });
  },[svgCircle.current]);

  useEffect(() => {
    if (frontImg != currentImg && !activ) {
      setActiv(true);
      setSense(frontImg < currentImg);
      setPrevious(!sense ? "front" : "back");
      sense ? setFrontImg(currentImg) : setBackImg(currentImg);
      setRadial({ offset: sense ? 0 : 100, offset1: sense ? 0 : 100 });
      
      animate(radial, {
        offset: {
          to: sense ? 100 : 0,
          duration: sense ? durationAnime.maxTime : durationAnime.minTime,
          ease: "easeInSine",
        },
        offset2: {
          to: sense ? 100 : 0,
          duration: sense ? durationAnime.minTime : durationAnime.maxTime,
          ease: "easeInSine",
        },
        onComplete: function () {
          !sense ? setFrontImg(currentImg) : setBackImg(currentImg);
          setSense(false);
          setActiv(false);
          setPrevious(null);
          setLastRapport({ rapport, newWidth });
        },
      });
    }
  });

  return (
    <div
      className="relative justify-center items-center flex-none rounded-full outline-4 outline-white outline-offset-8 bg-white overflow-hidden"
      style={{ width: dim + "px", height: dim + "px" }}
      ref={root}
    >
      <svg className="absolute z-10 left-0 top-0 w-full h-full">
        <defs>
          <mask id={"circle2" + key}>
            <circle
              r={sizeSvg.height}
              cx={sizeSvg.width / 2}
              cy={sizeSvg.height / 2}
              fill="#ffffff"
            />
          </mask>
        </defs>
        <image
          width={previouse == "back" ? lastRapport.newWidth : newWidth}
          height={dim}
          x={previouse == "back" ? -lastRapport.newWidth / 8 : -newWidth / 8}
          y={0}
          href={urlArr[backImg].src}
          mask={`url(#circle2${key})`}
        />
      </svg>
      <svg className="absolute z-20 left-0 top-0 w-full h-full" ref={svgCircle}>
        <defs>
          <radialGradient id={`grad${key}`} cx="50%" r="50%" fx="50%" fy="50%">
            <stop offset={radial.offset + "%"} stopColor="#ffffff" />
            <stop offset={radial.offset1 + "%"} stopColor="#ffffff" />
          </radialGradient>
          <mask id={"circle" + key}>
            <circle
              r={sizeSvg.height}
              cx={sizeSvg.width / 2}
              cy={sizeSvg.height / 2}
              fill={`url(#grad${key})`}
            />
          </mask>
        </defs>
        <image
          width={previouse == "front" ? lastRapport.newWidth : newWidth}
          height={dim}
          x={previouse == "front" ? -lastRapport.newWidth / 8 : -newWidth / 8}
          y={0}
          href={urlArr[frontImg].src}
          mask={`url(#circle${key})`}
        />
      </svg>
    </div>
  );
}
