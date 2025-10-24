import { create } from "zustand";

type State = {
    sizeSvg:{width: number, height:number}
    backImg:number
    frontImg:number
    sense:boolean
    activ:boolean
}

type Action = {
    upSizeSvg: (sizeSvg: State["sizeSvg"]) => void
    upBackImg: (backImg: State["backImg"]) => void
    upFrontImg: (frontImg: State["frontImg"]) => void
    upSense: (sense: State["sense"]) => void
}

// const useCarouselStore = create<State & Action>((set) => ({
//     sizeSvg:{height:0, width:0},
//     backImg:0,
//     frontImg:0,
//     sense:false,
//     activ:false,
//     upBackImg: 
// }))