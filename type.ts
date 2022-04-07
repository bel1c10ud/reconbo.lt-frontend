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
  'SingleItemOffers': string[]
}

export interface BonusStoreType {
  'BonusStoreOffers': BonusStoreOfferType[]
}

export interface BonusStoreOfferType {
  'BonusOfferID': string,
  'Offer': OfferType,
  'DiscountPercent': number,
  'DiscountCosts': object,
  'IsSeen': boolean
}

export interface OfferType {
  'OfferID': string,
  'IsDirectPurchase': boolean,
  'StartDate': string,
  'Cost': object,
  'Rewards': OfferRewardType[]
}

export interface OfferRewardType {
  'ItemID': string,
  'ItemTypeID': string,
  'Quantity': number
}

export interface SkinDataType {
  'uuid': string,
  'displayName': string,
  'levelItem': unknown,
  'displayIcon': string,
  'streamedVideo'?: string,
  'assetPath': string
}

export interface AuthObjType {
  access_token: undefined|string
  expiry_timestamp: undefined|number,
}