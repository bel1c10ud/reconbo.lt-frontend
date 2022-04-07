import { atom, selector } from 'recoil';
import { AuthObjType } from './type';

export const authObjAtom = atom<AuthObjType>({
  key: 'authObjAtom',
  default: {
    access_token: undefined,
    expiry_timestamp: undefined
  }
})

export const authObjSelector = selector({
  key: 'authObjSelector',
  get: function GetAuthObj() {

  }

})