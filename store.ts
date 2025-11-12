import { create } from "zustand";
import type { AuthObjType, LanguageCode, PopupType, RegionCode } from "@/type";

interface LanguageState {
  language: undefined | LanguageCode;
  setLanguage: (language: undefined | LanguageCode) => void;
}

export const useLanguageStore = create<LanguageState>()((set) => {
  return {
    language: undefined,
    setLanguage(language: undefined | LanguageCode) {
      set({ language });

      if (language) {
        document.cookie = `language=${language};`;
      }
    },
  };
});

interface RegionState {
  region: undefined | RegionCode;
  setRegion: (region: undefined | RegionCode) => void;
}

export const useRegionStore = create<RegionState>()((set) => {
  return {
    region: undefined,
    setRegion(region: undefined | RegionCode) {
      set({ region });
    },
  };
});

interface AuthObjState {
  authObj: Omit<AuthObjType, "isValid">;
  setAuthObj: (authObj: Omit<AuthObjType, "isValid">) => void;
}

export const useAuthObjStore = create<AuthObjState>()((set) => {
  return {
    authObj: {
      isInit: false,
      access_token: undefined,
      expiry_timestamp: undefined,
    },
    setAuthObj(authObj: Omit<AuthObjType, "isValid">) {
      set({ authObj });
    },
  };
});

interface IdTokenState {
  idToken: undefined | string;
  setIdToken: (idToken: undefined | string) => void;
}

export const useIdTokenStore = create<IdTokenState>()((set) => {
  return {
    idToken: undefined,
    setIdToken(idToken: undefined | string) {
      set({ idToken });
    },
  };
});

interface ShowSpinnerState {
  showSpinner: boolean;
  setShowSpinner: (showSpinner: boolean) => void;
}

export const useShowSpinnerStore = create<ShowSpinnerState>()((set) => {
  return {
    showSpinner: false,
    setShowSpinner(showSpinner: boolean) {
      set({ showSpinner });
    },
  };
});

interface PopupState {
  popup: PopupType;
  setPopup: (popup: PopupType) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupState>()((set, get) => {
  return {
    popup: {
      visiable: false,
      component: undefined,
    },
    setPopup(popup: PopupType) {
      set({ popup: { ...popup } });
    },
    closePopup() {
      set({ popup: { ...get().popup, visiable: false } });
    },
  };
});
