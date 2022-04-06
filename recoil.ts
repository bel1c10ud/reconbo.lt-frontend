import { atom } from 'recoil';

export const accessTokenAtom = atom<string|undefined>({
  key: 'accessTokenAtom',
  default: undefined
})