import { animated, useSpring, to, easings } from "@react-spring/web";
import { useState, useMemo, useEffect, useRef } from "react";

export default function CarouselCircle({
  urlArr,
  dim,
  currentImg,
  key = 0,
}: {
  urlArr: { src: string; height: number; width: number }[];
  dim: number;
  currentImg: number;
  key?: number;
}) {
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

  const svgCircle = useRef<null | SVGSVGElement>(null);
  const root = useRef<null | HTMLDivElement>(null);

  const { rapport, newWidth } = useMemo(
    () => calcWidth(urlArr[currentImg]),
    [currentImg]
  );

  const [lastRapport, setLastRapport] = useState({ rapport, newWidth });

  const durationAnime = { minTime: 600, maxTime: 800 };

  const endAnim = () => {
    !sense ? setFrontImg(currentImg) : setBackImg(currentImg);
    setSense(false);
    setActiv(false);
    setPrevious(null);
    setLastRapport({ rapport, newWidth });
  };

  const [spring, api] = useSpring(
    () => ({
      from: { offset: sense ? 100 : 0 },
      to: { offset: sense ? 0 : 100 },
      config: { duration: 3000, easing: easings.easeInSine },
    }),
    [sense]
  );

  const [spring2, api2] = useSpring(
    () => ({
      from: { offset: sense ? 100 : 0 },
      to: { offset: sense ? 0 : 100 },
      config: { duration: 4000, easing: easings.easeInSine },
    }),
    [sense]
  );

  useEffect(() => {
    if (svgCircle.current)
      setSizeSvg({
        width: svgCircle.current.clientWidth,
        height: svgCircle.current.clientHeight,
      });
  }, [svgCircle.current]);

  useEffect(() => {
    console.log(currentImg, frontImg, activ);
    if (frontImg != currentImg && !activ) {
      setActiv(true);
      setSense(frontImg < currentImg);
      setPrevious(!sense ? "front" : "back");
      sense ? setFrontImg(currentImg) : setBackImg(currentImg);
      setRadial({ offset: sense ? 0 : 100, offset1: sense ? 0 : 100 });
      api.start({
        from: { offset: sense ? 100 : 0 },
        to: { offset: sense ? 0 : 100 },
      });
      api2.start({
        from: { offset: sense ? 100 : 0 },
        to: { offset: sense ? 0 : 100 },
        onRest: endAnim,
      });
    }
  }, [currentImg, frontImg, activ, sense]);

  return (
    <>
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
        <svg
          className="absolute z-20 left-0 top-0 w-full h-full"
          ref={svgCircle}
        >
          <defs>
            <animated.radialGradient
              id={`grad${key}`}
              cx="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <animated.stop
                offset={to(spring.offset, (value) => `${Math.floor(value)}%`)}
                stopOpacity={1}
                stopColor="#ffffff"
              />
              <animated.stop
                offset={to(spring2.offset, (value) => `${Math.floor(value)}%`)}
                stopOpacity={0}
                stopColor="#ffffff"
              />
            </animated.radialGradient>
            <mask id={"circle" + key}>
              <circle
                r={sizeSvg.height}
                cx={sizeSvg.width / 2}
                cy={sizeSvg.height / 2}
                fill={`url(#grad${key})`}
              />
            </mask>
          </defs>
          <animated.image
            width={previouse == "front" ? lastRapport.newWidth : newWidth}
            height={dim}
            x={previouse == "front" ? -lastRapport.newWidth / 8 : -newWidth / 8}
            y={0}
            href={urlArr[frontImg].src}
            mask={`url(#circle${key})`}
          />
        </svg>
      </div>
    </>
  );
}
