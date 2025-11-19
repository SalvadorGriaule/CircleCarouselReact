# 🎞️ React CarouselCircle  
Composant React (TypeScript + React-Spring) qui transforme n’importe quelle liste d’images en **carousel radial** ultra-fluide – zéro dépendance runtime (hors `@react-spring/web`).

[![npm](https://img.shields.io/npm/v/@salvadorgriaule/react-carousel-circle?color=ff0066)](https://npmjs.com/package/@salvadorgriaule/react-carousel-circle)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![React](https://img.shields.io/badge/React-18+-61dafb)

---

## ✨ Ce qu’il fait
- Transition **circulaire** type « iris » entre deux images (masque SVG + radial-gradient)  
- **Timing asymétrique** (400 ms / 800 ms) pour un rendu naturel  
- **Responsive** : s’adapte à n’importe quelle taille carrée (`dim`)  
- **Full TypeScript** – prêt à l’emploi  
- **Léger** : seul `@react-spring/web` requis

---

## 📦 Installation

```bash
npm i @salvadorgriaule/react-carousel-circle
# ou
pnpm add @salvadorgriaule/react-carousel-circle
```

---

## 🚀 Début rapide

```tsx
import CarouselCircle from "@salvadorgriaule/react-carousel-circle";

const images = [
  { src: "/1.jpg", width: 1200, height: 800 },
  { src: "/2.jpg", width: 800, height: 800 },
  { src: "/3.jpg", width: 1600, height: 900 },
];

export default function App() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <CarouselCircle urlArr={images} dim={300} currentImg={index} />
      <button onClick={() => setIndex((i) => (i + 1) % images.length)}>Suivant</button>
    </>
  );
}
```

---

## 📌 Props

| Prop        | Type | Obligatoire | Description |
|-------------|------|-------------|-------------|
| `urlArr` | `{ src: string; width: number; height: number }[]` | ✅ | Images + dimensions originales |
| `dim` | `number` | ✅ | Taille (px) du cercle (conteneur carré) |
| `currentImg` | `number` | ✅ | Index de l’image à afficher |
| `key` | `number \| string` | — | Clé optionnelle pour IDs uniques si plusieurs instances |

---

## 🎨 Personnalisation

Le composant rend un cercle blanc avec `outline-white outline-offset-8`.  
À personnaliser via CSS :

```css
.carousel-circle {
  outline-color: theme(colors.sky.500);
}
```

---

## 🧪 Développement

```bash
git clone https://github.com/SalvadorGriaule/react-carousel-circle.git
cd react-carousel-circle
pnpm i
pnpm dev        # http://localhost:5173
```

---

## 📁 Structure

```
src/
├── CarouselCircle.tsx   # composant principal
├── module/resize.ts     # utilitaire de calcul de taille
└── index.ts             # export { CarouselCircle }
```

---

## 📝 Licence

MIT – utilisez, forkez, animez !

