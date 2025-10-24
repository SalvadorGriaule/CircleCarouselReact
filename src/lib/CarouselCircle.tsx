import { useState, useMemo, useEffect, useRef } from "react";
import { useSpring, animated, to } from "@react-spring/web";

interface ImageData {
  src: string;
  height: number;
  width: number;
}
export default function CarouselCircle({
  urlArr,
  dim,
  currentImg,
  key = 0,
}: {
  urlArr: ImageData[];
  dim: number;
  currentImg: number;
  key?: number;
}) {
  // Memoized width calculation
  const calcWidth = (dimImg: ImageData) => {
    const rapport = dimImg.width / dimImg.height;
    return {
      rapport,
      newWidth: dim,
      newHeight: rapport < 0 ? dim * rapport : dim / rapport,
    };
  };

  // State management
  const [sizeSvg, setSizeSvg] = useState({ width: 0, height: 0 });
  const [backImg, setBackImg] = useState(0);
  const [frontImg, setFrontImg] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState<
    "forward" | "backward" | null
  >(null);
  const [previouse, setPreviouse] = useState<"back" | "front" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs
  const svgRef = useRef<SVGSVGElement>(null);

  // Memoized width calculation
  const { rapport, newWidth, newHeight } = useMemo(
    () => calcWidth(urlArr[currentImg]),
    [currentImg, urlArr, dim]
  );

  // Last rapport state for smooth transitions
  const [lastRapport, setLastRapport] = useState({ rapport, newWidth });

  // Separate springs for white and black offsets
  const [whiteOffsetSpring, whiteOffsetApi] = useSpring(() => ({}));

  const [blackOffsetSpring, blackOffsetApi] = useSpring(() => ({}));

  // Effect to handle image transitions
  useEffect(() => {
    if (frontImg !== currentImg && !isAnimating) {
      const newTransitionDirection =
        frontImg < currentImg ? "forward" : "backward";

      setIsAnimating(true);
      setTransitionDirection(newTransitionDirection);
      setPreviouse(newTransitionDirection === "forward" ? "back" : "front");

      // Update images based on direction
      newTransitionDirection === "forward"
        ? setFrontImg(currentImg)
        : setBackImg(currentImg);

      // Animate offsets with different timings
      Promise.all([
        new Promise((resolve) =>
          whiteOffsetApi.start({
            from: { value: frontImg < currentImg ? 0 : 100 },
            to: { value: frontImg < currentImg ? 100 : 0 },
            config: { duration: frontImg < currentImg ? 800 : 400 },
            onRest: resolve,
          })
        ),
        new Promise((resolve) =>
          blackOffsetApi.start({
            from: { value: frontImg < currentImg ? 0 : 100 },
            to: { value: frontImg < currentImg ? 100 : 0 },
            config: { duration: frontImg < currentImg ? 400 : 800 },
            onRest: resolve,
          })
        ),
      ]).then(() => {
        // Final state updates
        newTransitionDirection === "backward"
          ? setFrontImg(currentImg)
          : setBackImg(currentImg);

        setIsAnimating(false);
        setTransitionDirection(null);
        setPreviouse(null);
        setLastRapport({ rapport, newWidth });
      });
    }
  }, [currentImg]);
  // Update SVG size
  useEffect(() => {
    if (svgRef.current) {
      setSizeSvg({
        width: svgRef.current.clientWidth,
        height: svgRef.current.clientHeight,
      });
    }
  }, [svgRef.current]);

  return (
    <>
      <p className="mb-6">
        {newWidth} {lastRapport.newWidth}
      </p>
      <div
        className="relative justify-center items-center flex-none rounded-full outline-4 outline-white outline-offset-8 bg-white overflow-hidden"
        style={{ width: `${dim}px`, height: `${dim}px` }}
      >
        {/* Background Image Layer */}
        <svg className="absolute z-10 left-0 top-0 w-full h-full">
          <defs>
            <mask id={`circle2-${key}`}>
              <circle
                r={sizeSvg.height}
                cx={sizeSvg.width / 2}
                cy={sizeSvg.height / 2}
                fill="#ffffff"
              />
            </mask>
          </defs>
          <image
            width={newWidth}
            height={newHeight}
            x={previouse === "front" ? -dim / 1000 : -dim / 1000}
            y={0}
            href={urlArr[backImg].src}
            mask={`url(#circle2-${key})`}
          />
        </svg>

        {/* Animated Foreground Layer */}
        <svg
          ref={svgRef}
          className="absolute z-20 left-0 top-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <animated.radialGradient
              id={`grad-${key}`}
              cx="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <animated.stop
                offset={to(whiteOffsetSpring.value, (value) => `${value}%`)}
                stopColor="#ffffff"
              />
              <animated.stop
                offset={to(blackOffsetSpring.value, (value) => `${value}%`)}
                stopColor="#000000"
              />
            </animated.radialGradient>

            <mask id={`circle-${key}`}>
              <circle
                r={sizeSvg.height}
                cx={sizeSvg.width / 2}
                cy={sizeSvg.height / 2}
                fill={`url(#grad-${key})`}
              />
            </mask>
          </defs>

          <animated.image
            width={newWidth}
            height={newHeight}
            x={previouse === "front" ? -dim / 1000 : -dim / 1000}
            y={0}
            href={urlArr[frontImg].src}
            mask={`url(#circle-${key})`}
          />
        </svg>
      </div>
    </>
  );
}
