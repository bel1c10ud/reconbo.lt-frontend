import { atom } from 'recoil';
import { AuthObjType, ContentTierType, OfferType, SkinType } from './type';
import { RegionCode, LanguageCode } from './options';

export const languageAtom = atom<undefined|LanguageCode>({
  key: 'languageAtom',
  default: undefined
});

export const regionAtom = atom<undefined|RegionCode>({
  key: 'regionAtom',
  default: undefined
})

export const authObjAtom = atom<AuthObjType>({
  key: 'authObjAtom',
  default: {
    access_token: undefined,
    expiry_timestamp: undefined
  }
});

export const skinsDataAtom = atom<undefined|SkinType[]|Error>({
  key: 'skinsDataAtom',
  default: undefined
});

export const contentTiersDataAtom = atom<undefined|ContentTierType[]|Error>({
  key: 'contentTiersDataAtom',
  default: undefined
});

export const offersDataAtom = atom<undefined|OfferType[]|Error>({
  key: 'offersDataAtom',
  default: undefined
});

export const isPopupAtom = atom<boolean>({
  key: 'isPopupAtom',
  default: false
});

export const popupComponentAtom = atom<((props?: any) => JSX.Element)|undefined>({
  key: 'popupComponentAtom',
  default: undefined
});