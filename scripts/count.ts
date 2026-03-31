import { CITIES_100 } from '../src/data/cities-100';
import { CITIES_EXTENDED } from '../src/data/cities-extended';

const ALL = [...CITIES_100, ...CITIES_EXTENDED];

const fr = ALL.filter(c => !c.country || c.country === 'FR').length;
const ch = ALL.filter(c => c.country === 'CH').length;
const be = ALL.filter(c => c.country === 'BE').length;

console.log(`TOTAL: ${ALL.length}`);
console.log(`FRANCE: ${fr}`);
console.log(`SUISSE: ${ch}`);
console.log(`BELGIQUE: ${be}`);
