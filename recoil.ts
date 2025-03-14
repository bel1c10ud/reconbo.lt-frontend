import { atom } from 'recoil';
import { AuthObjType, LanguageCode, RegionCode } from './type';

// FrontEnd State

export const languageAtom = atom<undefined|LanguageCode>({
  key: 'languageAtom',
  default: undefined,  
  effects: [
    ({ setSelf, onSet}) => {
      setSelf((prevValue) => {
        if (prevValue) {
          document.cookie = `language=${prevValue};`;
        }
        return prevValue;
      });

      onSet((newValue) => {
        document.cookie = `language=${newValue};`;
      });
    },
  ],
});

export const regionAtom = atom<undefined|RegionCode>({
  key: 'regionAtom',
  default: undefined
});

export const authObjAtom = atom<Omit<AuthObjType, 'isValid'>>({
  key: 'authObjAtom',
  default: {
    isInit: false,
    access_token: undefined,
    expiry_timestamp: undefined
  }
});

export const showSpinnerAtom = atom<boolean>({
  key: 'showSpinnerAtom',
  default: false,
})

export const popupAtom = atom({
  key: 'popupAtom',
  default: {
    visiable: false,
    component: () => {}
  }
})

export const isPopupAtom = atom<boolean>({
  key: 'isPopupAtom',
  default: false
});

export const popupComponentAtom = atom<((props?: any) => JSX.Element)|undefined>({
  key: 'popupComponentAtom',
  default: undefined
});
