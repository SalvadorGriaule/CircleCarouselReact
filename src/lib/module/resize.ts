export const resize = (dim: { h: number, w: number }, dimCadre: number) => {
    let res = { w: dim.w, h: dim.h }
    let rapport = res.w / res.h
    let a = 0
    if (dim.w < dimCadre || dim.h < dimCadre) {
        a = dim.w > dim.h ? dimCadre - dim.h : dimCadre - dim.w
        res = { w: dim.w + a, h: dim.h + a }
    } else if (dim.w > dimCadre || dim.h > dimCadre) {
        a = rapport > 1 ? dim.h - dimCadre : dim.w - dimCadre;
        res = { w: dim.w - a, h: dim.h - a }

    }
    console.log(res, dimCadre, dim, rapport);

    return res
}