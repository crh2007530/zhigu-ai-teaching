import {readFile} from 'node:fs/promises';
import './tutor-core.js';
export async function createTutor(options){
 const cases=JSON.parse(await readFile(new URL('./lesson-cases.json',options.root),'utf8'));
 return globalThis.ZhiguTutorFactory({...options,cases});
}
