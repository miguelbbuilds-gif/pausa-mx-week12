import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "week15");
mkdirSync(root, { recursive: true });

const coverage = [
  "PAUSA MX calcula únicamente con los datos que ingresas.",
  "No verifica que hayas incluido todas tus obligaciones.",
  "El resultado no determina si una compra es asequible para ti.",
];

function esc(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function footer(y, width) {
  const lines = coverage
    .map(
      (line, index) =>
        `<text x="64" y="${y + 36 + index * 28}" fill="#8a5a12" font-family="Segoe UI, Arial, sans-serif" font-size="20">${esc(line)}</text>`,
    )
    .join("");
  return `<rect x="40" y="${y}" width="${width - 80}" height="132" rx="18" fill="#f8ecd4"/>${lines}`;
}

function brand(label) {
  return `
    <text x="64" y="78" fill="#0f766e" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="700">PAUSA MX</text>
    <text x="64" y="118" fill="#8a5a12" font-family="Segoe UI, Arial, sans-serif" font-size="22">${esc(label)}</text>
  `;
}

function square(name, body) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" role="img">
  <rect width="1080" height="1080" fill="#f7f4ee"/>
  ${brand("Datos de demostración")}
  ${body}
  ${footer(900, 1080)}
</svg>`;
  writeFileSync(path.join(root, name), svg);
}

square(
  "carousel-1-pausa.svg",
  `
  <text x="64" y="280" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="64">Antes de comprar</text>
  <text x="64" y="360" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="52">un celular de $12,000…</text>
  <text x="64" y="470" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="32">Compara qué cambia en tu dinero disponible</text>
  <text x="64" y="518" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="32">con los datos que ingreses.</text>
  <rect x="64" y="600" width="360" height="72" rx="36" fill="#0f766e"/>
  <text x="92" y="646" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="28">Prueba una compra</text>
  <text x="64" y="760" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="24">Pieza 1 de 4 · Carrusel · No es un veredicto</text>
  `,
);

square(
  "carousel-2-datos.svg",
  `
  <text x="64" y="220" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="48">Los datos del ejemplo</text>
  <text x="64" y="320" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Dinero disponible · $18,000</text>
  <text x="64" y="380" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Gastos esenciales · $9,000</text>
  <text x="64" y="440" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Pagos ya comprometidos · $2,500</text>
  <text x="64" y="520" fill="#0f766e" font-family="Segoe UI, Arial, sans-serif" font-size="32">Después de esas obligaciones · $6,500</text>
  <text x="64" y="600" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Precio de contado · $12,000</text>
  <text x="64" y="720" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="24">Pieza 2 de 4 · Estas cifras no son de una persona</text>
  <rect x="64" y="780" width="360" height="64" rx="32" fill="#0f766e"/>
  <text x="92" y="822" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="26">Prueba una compra</text>
  `,
);

square(
  "carousel-3-columnas.svg",
  `
  <text x="64" y="210" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="46">Dos escenarios, sin ganador</text>
  <rect x="64" y="260" width="450" height="250" rx="24" fill="#fffcf7" stroke="#d9d2c5" stroke-width="2"/>
  <text x="92" y="320" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="32">Comprar ahora</text>
  <text x="92" y="380" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="26">Quedarían −$5,500 hoy</text>
  <text x="92" y="440" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="22">No es permiso para comprar</text>
  <rect x="546" y="260" width="470" height="250" rx="24" fill="#fffcf7" stroke="#d9d2c5" stroke-width="2"/>
  <text x="574" y="320" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="32">Esperar</text>
  <text x="574" y="380" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="26">Quedarían $6,500 hoy</text>
  <text x="574" y="440" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="22">Tampoco es el escenario premio</text>
  <text x="64" y="620" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="26">Mismos datos de demostración. La decisión no está aquí.</text>
  <rect x="64" y="700" width="360" height="64" rx="32" fill="#0f766e"/>
  <text x="92" y="742" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="26">Prueba una compra</text>
  <text x="64" y="840" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="22">Pieza 3 de 4 · Carrusel</text>
  `,
);

square(
  "carousel-4-limites.svg",
  `
  <text x="64" y="240" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="52">Esto no decide la compra</text>
  <text x="64" y="340" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="30">El ejemplo no dice que el celular quepa.</text>
  <text x="64" y="390" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="30">Tampoco dice que debas esperarlo.</text>
  <rect x="64" y="470" width="360" height="72" rx="36" fill="#0f766e"/>
  <text x="92" y="516" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="28">Prueba una compra</text>
  <text x="64" y="640" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="26">Lleva tus cifras a Mi Pausa. Estas son de demostración.</text>
  <text x="64" y="760" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="22">Pieza 4 de 4 · Carrusel · PAUSA MX</text>
  `,
);

const storyboard = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920" role="img">
  <rect width="1080" height="1920" fill="#f7f4ee"/>
  ${brand("Datos de demostración · Guion visual, no es un video")}
  <text x="64" y="210" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="58">Comprar ahora</text>
  <text x="64" y="280" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="58">vs esperar</text>
  <rect x="64" y="340" width="952" height="220" rx="24" fill="#fffcf7" stroke="#d9d2c5"/>
  <text x="96" y="400" fill="#0f766e" font-family="Segoe UI, Arial, sans-serif" font-size="24">CUADRO 1 · LOS DATOS</text>
  <text x="96" y="450" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="28">Disponible $18,000 · Esenciales $9,000</text>
  <text x="96" y="495" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="28">Ya comprometidos $2,500 · Contado $12,000</text>
  <rect x="64" y="590" width="952" height="240" rx="24" fill="#fffcf7" stroke="#d9d2c5"/>
  <text x="96" y="650" fill="#0f766e" font-family="Segoe UI, Arial, sans-serif" font-size="24">CUADRO 2 · COMPRAR AHORA</text>
  <text x="96" y="720" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Quedarían −$5,500 hoy</text>
  <text x="96" y="775" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="26">No es una instrucción de comprar</text>
  <rect x="64" y="860" width="952" height="240" rx="24" fill="#fffcf7" stroke="#d9d2c5"/>
  <text x="96" y="920" fill="#0f766e" font-family="Segoe UI, Arial, sans-serif" font-size="24">CUADRO 3 · ESPERAR</text>
  <text x="96" y="990" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="32">Quedarían $6,500 hoy, sin pagos nuevos</text>
  <text x="96" y="1045" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="26">Esperar no es el escenario ganador</text>
  <rect x="64" y="1140" width="952" height="200" rx="24" fill="#122033"/>
  <text x="96" y="1210" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="28">Mismos datos. Ninguna columna decide.</text>
  <text x="96" y="1270" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="32">Prueba una compra</text>
  <text x="64" y="1420" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="24">Formato: guion vertical 9:16. No existe un MP4 de esta pieza.</text>
  ${footer(1680, 1080)}
</svg>`;
writeFileSync(path.join(root, "storyboard-comprar-ahora-vs-esperar.svg"), storyboard);

const card = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img">
  <rect width="1080" height="1350" fill="#f7f4ee"/>
  ${brand("Datos de demostración")}
  <text x="64" y="230" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="54">Lo que realmente</text>
  <text x="64" y="300" fill="#122033" font-family="Georgia, 'Times New Roman', serif" font-size="54">comprometes</text>
  <text x="64" y="400" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="28">Precio de contado del ejemplo</text>
  <text x="64" y="450" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="40">$12,000</text>
  <text x="64" y="540" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="28">Plan escrito: enganche $2,000 + 12 × $1,100</text>
  <text x="64" y="600" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="40">Total escrito · $15,200</text>
  <text x="64" y="680" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="30">Diferencia frente al contado · $3,200</text>
  <text x="64" y="760" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="26">Esa diferencia sale de la suma. No se inventó un interés.</text>
  <text x="64" y="840" fill="#122033" font-family="Segoe UI, Arial, sans-serif" font-size="28">Después del enganche quedarían $4,500 hoy.</text>
  <text x="64" y="890" fill="#5b6776" font-family="Segoe UI, Arial, sans-serif" font-size="26">Los pagos siguientes no se comparan con un ingreso futuro.</text>
  <rect x="64" y="960" width="360" height="72" rx="36" fill="#0f766e"/>
  <text x="92" y="1006" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="28">Prueba una compra</text>
  ${footer(1140, 1080)}
</svg>`;
writeFileSync(path.join(root, "card-lo-que-comprometes.svg"), card);

console.log("wrote week 15 assets");
