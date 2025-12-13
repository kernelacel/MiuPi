const esToBr = {
  "hola":"mimi", "culona":"muku", "queso":"miupi", "yo":"mmi", "tu":"ti",
  "usted":"usti", "el":"mu", "ella":"mimiu", "nosotros":"nosi",
  "ellos":"lomu", "ellas":"momi", "de":"miu", "la":"my", "en":"nui",
  "y":"yii", "a":"mi", "los":"lisi", "las":"lasi", "un":"numi",
  "una":"nami", "por":"mii", "con":"muu", "para":"paru", "sin":"suni",
  "del":"miku", "al":"mila", "soy":"soi", "eres":"ersi", "es":"esi",
  "somos":"somi", "son":"suni", "que":"ku", "como":"miomu",
  "cuando":"kuni", "donde":"doni", "quien":"quin", "cual":"kuli",
  "porque":"poku", "pero":"peru", "mas":"miisi", "menos":"menoi",
  "muy":"muyi", "todo":"todu", "nada":"nami", "algo":"alpi", "si":"sii",
  "no":"nuimu", "ya":"ya", "ahora":"auri", "despues":"desu",
  "antes":"anti", "mi":"mui", "mis":"misi", "tu":"tiu", "tus":"tusi",
  "su":"sumi", "sus":"susi", "nuestro":"nusu", "nuestros":"nusis",
  "hoy":"mimiti", "mañana":"miini", "ayer":"runi", "siempre":"wuwu",
  "nunca":"ninin", "amor":"mimiu", "amo":"mimiu","amigo":"mimo", "familia":"fami",
  "casa":"cami", "trabajo":"tamu", "escuela":"escu", "dinero":"dini",
  "tiempo":"temu", "mano":"mumi", "ojo":"omu", "boca":"bomi",
  "cabeza":"kabi", "corazon":"kori", "feliz":"vify", "triste":"nini",
  "miedo":"runi", "enojo":"noku", "risa":"miji", "sueño":"sumi",
  "hambre":"hami", "sed":"semi", "agua":"agu", "comida":"codi",
  "coche":"cochi", "calle":"kali", "luz":"luzi", "puerta":"puti",
  "ventana":"veni", "mesa":"mesi", "silla":"sili", "juego":"miji",
  "musica":"musi", "baile":"bai", "fiesta":"fesi", "hermosa":"miyi",
  "princesa":"muki", "pene":"mupi", "muslo":"miwu", "tetona":"misi",
  "pinchechota":"muzi", "miy":"te", "meica":"mei", "te":"miy", "xd":"xidii",
  "diego":"mie", "sensei":"miisei", "maestro":"maisei",
  "tengo":"miniki", "hacen":"kuriti", "amikos":"mibros",
  "esperando":"miloti", "prenda":"kitemu", "stream":"nomei",
  "asustado":"nininini", "estoy":"estimi", "dibujando":"pixili",
  "vos":"tumi", "pe":"piqui", "esta":"muiya", "quedando":"sumiya",
  "uff":"bufi", "bruatal":"krifi", "aunque":"sikimu",
  "se":"aitu", "unas":"bropas", "letras":"siniki", "hay":"mimu",
  "subilo":"altru", "chat":"hibrois", "potavar":"kirimi",
  "bueno":"brini", "ojala":"kitsu", "le":"di", "agarre":"triku",
  "ganas":"vitri", "jugar":"mikoti", "repo":"rukai",
  "botecitos":"britinis", "descanen":"mimiri", "amagos":"xixu",
  "hablan":"bripirly", "estan":"koni", "reforzando":"mofirti",
  "amasta":"mimiuki", "alumano":"humoti", "verdad":"ferdi",
  "vez":"zukai", "hace":"haku", "pucho":"puchu", "sueno":"ninifi",
  "sueño":"oyminini", "descanse":"susimi", "botapaus":"bripiuhi",
  "necesito":"nekiti", "sección":"misitiri", "beso":"pimua",
  "necesita":"nikis", "doble":"dodi", "je":"ki",
};
  
const brToEs = {};
for (const [es, br] of Object.entries(esToBr)) {
  if (!brToEs[br]) brToEs[br] = es;
}


// Nuevo alfabeto broteñol sin colisiones
const esAlphabet = {
  a: "mi",  b: "bii",  c: "cii",  d: "dii",  e: "eii",  f: "fii",
  g: "pii", h: "hii",  i: "iii", j: "mei", k: "kii", l: "lii",
  m: "mii", n: "nii", o: "moo", p: "pi",  q: "qui", r: "ri",
  s: "si",  t: "ti",  u: "muu", v: "vi",  w: "wi",  x: "xi",
  y: "yi",  z: "zi"
};

const brAlphabet = {};
for (const [letter, token] of Object.entries(esAlphabet)) {
  if (!brAlphabet[token]) brAlphabet[token] = letter;
}
const brTokens = Object.keys(brAlphabet).sort((a,b) => b.length - a.length);

function normalize(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function parseBrWord(word) {
  let i = 0;
  let letters = '';
  while (i < word.length) {
    let found = false;
    for (const tok of brTokens) {
      if (word.startsWith(tok, i)) {
        letters += brAlphabet[tok] || '';
        i += tok.length;
        found = true;
        break;
      }
    }
    if (!found) {
      letters += word[i];
      i++;
    }
  }
  return letters;
}

function translateEsToBr(text) {
  const words = text.trim().split(/\s+/);
  const result = [];
  const detail = [];
  for (const w of words) {
    const key = normalize(w);
    if (esToBr[key]) {
      result.push(esToBr[key]);
      detail.push(`${w}→${esToBr[key]}`);
    } else {
      const tokens = [];
      for (const ch of key) {
        tokens.push(esAlphabet[ch] || ch);
      }
      const tr = tokens.join(' ');
      result.push(`"${tr}"`);
      detail.push(`${w}→"${tr}"`);
    }
  }
  return {text: result.join(' '), breakdown: detail.join(' | ') + ' |'};
}

function translateBrToEs(text) {
  const tokens = text.trim().toLowerCase().match(/"[^"]+"|\S+/g) || [];
  if (!tokens.length) return { text: '', breakdown: '' };

  const words = [];
  const detail = [];

  tokens.forEach(t => {
    if (t.startsWith('"') && t.endsWith('"')) {
      const inside = t.slice(1, -1).trim();
      const parts = inside.split(/\s+/).filter(Boolean);
      let letters = '';
      parts.forEach(p => {
        const letter = brAlphabet[p] || parseBrWord(p);
        letters += letter;
        detail.push(`${p}→${letter}`);
      });
      words.push(letters);
    } else if (brToEs[t]) {
      words.push(brToEs[t]);
      detail.push(`${t}→${brToEs[t]}`);
    } else {
      const letters = parseBrWord(t);
      words.push(letters);
      detail.push(`${t}→${letters}`);
    }
  });

  return { text: words.join(' '), breakdown: detail.join(' | ') + ' |' };
}

function clearResult() {
  document.getElementById('result').innerHTML = '';
}

function showResult(res) {
  const div = document.getElementById('result');
  div.innerHTML = `${res.text}<br>🌱 Desglose: ${res.breakdown}`;
}

function handleToBro() {
  const input = document.getElementById('text-input');
  const text = input.value;
  if (!text.trim()) return;
  if (text !== text.toLowerCase()) {
    alert("No se permiten mayúsculas");
    return;
  }
  clearResult();
  const res = translateEsToBr(text);
  showResult(res);
}

function handleToEs() {
  const input = document.getElementById('text-input');
  const text = input.value;
  if (!text.trim()) return;
  if (text !== text.toLowerCase()) {
    alert("No se permiten mayúsculas");
    return;
  }
  clearResult();
  const res = translateBrToEs(text.toLowerCase());
  showResult(res);
}

function speakResult() {
  const div = document.getElementById('result');
  const text = div.innerText.trim();
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

window.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('text-input');
  input.addEventListener('input', () => {
    const lower = input.value.toLowerCase();
    if (input.value !== lower) input.value = lower;
  });
  document.getElementById('to-bro').addEventListener('click', handleToBro);
  document.getElementById('to-es').addEventListener('click', handleToEs);
  document.getElementById('speak').addEventListener('click', speakResult);
});
