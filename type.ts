export interface CookieType {
  name: string,
  value: string
}

export interface StoreDataType {
  FeaturedBundle: object,
  SkinsPanelLayout: SkinsPanelLayoutType,
  BonusStore?: BonusStoreType
}

export interface SkinsPanelLayoutType {
  'SingleItemOffers': string[],
  'SingleItemOffersRemainingDurationInSeconds': number
}

export interface BonusStoreType {
  'BonusStoreOffers': BonusStoreOfferType[]
}

export interface BonusStoreOfferType {
  'BonusOfferID': string,
  'Offer': OfferType,
  'DiscountPercent': number,
  'DiscountCosts': {
    "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741": number
  },
  'IsSeen': boolean
}

export interface OfferType {
  'OfferID': string,
  'IsDirectPurchase': boolean,
  'StartDate': string,
  'Cost': any,
  'Rewards': OfferRewardType[]
}

export interface OfferRewardType {
  'ItemID': string,
  'ItemTypeID': string,
  'Quantity': number
}

export interface SkinLevelType {
  'uuid': string,
  'displayName': string,
  'levelItem': unknown,
  'displayIcon': string,
  'streamedVideo'?: string,
  'assetPath': string
}

export interface SkinChromaType {
  'uuid': string,
  'displayName': string,
  'displayIcon': string,
  'assetPath': string,
  'fullRender': string,
  'streamedVideo'?: string
  'swatch': string,
}

export interface AuthObjType {
  access_token: undefined|string
  expiry_timestamp: undefined|number,
}

export interface SkinType {
  'uuid': string,
  'contentTierUuid': string,
  'themeUuid': string,
  'displayName': string,
  'displayIcon': string,
  'wallpaper'? : string,
  'assetPath': string,
  'levels': SkinLevelType[]
  'chromas': SkinChromaType[]
}

export interface ContentTierType {
  'uuid': string,
  'rank': number,
  'devName': string,
  'displayIcon': string,
  'assetPath': string,
  'highlightColor': string,
  'juiceCost': number,
  'juiceValue': number,
}


export interface DiscountType {
  discountCosts: {
    "85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741": number
  },
  discountPercent: number
}