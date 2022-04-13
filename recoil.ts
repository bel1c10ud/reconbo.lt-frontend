import { atom, selector } from 'recoil';
import { AuthObjType, ContentTierType, OfferType, SkinType } from './type';

export const authObjAtom = atom<AuthObjType>({
  key: 'authObjAtom',
  default: {
    access_token: undefined,
    expiry_timestamp: undefined
  }
})

export const skinsDataAtom = atom<undefined|SkinType[]|Error>({
  key: 'skinsDataAtom',
  default: undefined
})

export const contentTiersDataAtom = atom<undefined|ContentTierType[]|Error>({
  key: 'contentTiersDataAtom',
  default: undefined
})

export const offersDataAtom = atom<undefined|OfferType[]|Error>({
  key: 'offersDataAtom',
  default: undefined
})