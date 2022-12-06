// frontend Type
export interface CookieType {
  name: string,
  value: string
}

export interface AuthObjType {
  isInit?: boolean,
  access_token: undefined|string
  expiry_timestamp: undefined|number
  isValid: boolean
}

export interface AsyncData<Type> {
  error: any | Error | undefined,
  data: Type | undefined,
  isLoading: boolean
}

// External API(valorant-api.com) Response Data Type
export namespace ExternalAPI {

  export enum Endpoint {
    skins = 'https://valorant-api.com/v1/weapons/skins',
    contentTiers = 'https://valorant-api.com/v1/contenttiers',
    sprays = 'https://valorant-api.com/v1/sprays',
    playerTitles = 'https://valorant-api.com/v1/playertitles',
    playerCards = 'https://valorant-api.com/v1/playercards',
    bundles = 'https://valorant-api.com/v1/bundles',
    buddies = 'https://valorant-api.com/v1/buddies',
    weapons = 'https://valorant-api.com/v1/weapons'
  }

  export enum ThemeUuid {
    Standard = '5a629df4-4765-0214-bd40-fbb96542941f',
    Random = '0d7a5bfb-4850-098e-1821-d989bbfd58a8'
  }

  export interface Response<T> {
    status: number
    data: T[]
  }

  export interface BuddyLevel {
    uuid: string
    charmLevel: number
    displayName: string 
    displayIcon: string
    assetPath: string
  }

  export interface Buddy {
    uuid: string
    displayName: string
    isHiddenIfNotOwned: boolean
    themeUuid: ThemeUuid|string
    displayIcon: string
    assetPath: string
    levels: BuddyLevel[]
  }

  export interface PlayerCard {
    uuid: string
    displayName: string
    isHiddenIfNotOwned: boolean
    themeUuid: ThemeUuid|string
    displayIcon: string
    smallArt: string
    wideArt: string
    largeArt: string
    assetPath: string
  }

  export interface PlayerTitle {
    uuid: string
    displayName: string
    titleText: string
    isHiddenIfNotOwned: boolean
    assetPath: string
  }

  export enum SkinLevelItemType {
    VFX = 'EEquippableSkinLevelItem::VFX',
    ANIMATION = 'EEquippableSkinLevelItem::Animation',
    FINISHER = 'EEquippableSkinLevelItem::Finisher',
    KILL_EFFECT = 'EEquippableSkinLevelItem::KillEffect',
    KILL_BANNER = 'EEquippableSkinLevelItem::KillBanner',
    FISH_ANIMATION = 'EEquippableSkinLevelItem::FishAnimation',
  }

  export type SkinLevelUUID = string;

  export interface SkinLevel {
    uuid: SkinLevelUUID,
    displayName: string,
    levelItem: undefined|string|SkinLevelItemType,
    displayIcon: string,
    streamedVideo?: string,
    assetPath: string
  }

  export type SkinChromaUUID = string;

  export interface SkinChroma {
    uuid: SkinChromaUUID,
    displayName: string,
    displayIcon: string,
    assetPath: string,
    fullRender: string,
    streamedVideo?: string
    swatch: string,
  }

  export type SkinUUID = string;

  export interface Skin {
    uuid: SkinUUID,
    contentTierUuid: string,
    themeUuid: ThemeUuid|string,
    displayName: string,
    displayIcon: string,
    wallpaper? : string,
    assetPath: string,
    levels: SkinLevel[],
    chromas: SkinChroma[]
  }

  export interface SprayLevel {
    uuid: string
    sprayLevel: number
    displayName: string
    displayIcon: string
    assetPath: string
  }

  export interface Spray {
    uuid: string
    displayName: string
    category: string
    themeUuid: ThemeUuid|string
    displayIcon: string
    fullIcon: string
    fullTransparentIcon: string
    animationPng: string
    animationGif: string
    assetPath: string
    levels: SprayLevel[]
  }

  export interface ContentTier {
    uuid: string,
    rank: number,
    devName: string,
    displayIcon: string,
    assetPath: string,
    highlightColor: string,
    juiceCost: number,
    juiceValue: number,
  }

  export interface Bundle {
    assetPath: string,
    description: string,
    displayIcon: string,
    displayIcon2: string,
    displayName: string,
    displayNameSubText?: string,
    extraDescription?: string,
    promoDescription?: string,
    useAdditionalContext: boolean,
    uuid: string,
    verticalPromoImage: string,
  }

  export interface ShopData {
    cost: number,
    category: string,
    categoryText: string,
    gridPosition: any,
    canBeTrashed: Boolean,
    image: string|null,
    newImage: string|null,
    newImage2: string|null,
    assetPath: string
  }

  export interface WeaponADSStats {
    zoomMultiplier: number,
    fireRate: number,
    runSpeedMultiplier: number,
    burstCount: number,
    firstBulletAccuracy: number
  }

  export interface WeaponDamageRange {
    rangeStartMeters: number,
    rangeEndMeters: number,
    headDamage: number,
    bodyDamage: number,
    legDamage: number,
  }

  export interface WeaponStats {
    fireRate: number,
    magazineSize: number,
    runSpeedMultiplier:number,
    equipTimeSeconds: number,
    reloadTimeSeconds: number,
    firstBulletAccuracy: number,
    shotgunPelletCount: number,
    wallPenetration: string,
    feature: string,
    fireMode: string|null,
    altFireType: string,
    adsStats: WeaponADSStats,
    altShotgunStats: string|null,
    airBurstStats: string|null,
    damageRanges: WeaponDamageRange[]
  }
  
  export interface Weapon {
    uuid: string,
    displayName: string,
    category: string,
    defaultSkinUuid: string,
    killStreamIcon: string,
    assetPath: string,
    weaponStats: WeaponStats,
    shopData: ShopData,
    skins: Skin[]
  }
}

// Valorant Client API Data Type
export namespace ClientAPI {
  export enum Key {
    'store',
    'offers'
  }
  export enum Endpoint {
    store = '/rewrite/${region}/riot-pvp/${region}/storefront/${puuid}',
    offers = '/rewrite/${region}/riot-pvp/${region}/offers',
  }


  export enum ItemTypeID {
    ID0 = '51c9eb99-3e6b-4658-801f-a5a7fd64bb9d',
    ID1 = 'bcef87d6-209b-46c6-8b19-fbe40bd95abc',
    SkinLevelTypeID = 'e7c63390-eda7-46e0-bb7a-a6abdacd2433',
    SkinChromaTypeID = '3ad1b2b2-acdb-4524-852f-954a76ddae0a',
    ID4 = '77258665-71d1-4623-bc72-44db9bd5b3b3',
    AgentTypeID = '01bb38e1-da47-4e6a-9b3d-945fe4655707',
    ID6 = '6520634c-bd1e-4fc4-81af-cac5dc723105',
    ID7 = '290f8769-97c6-492a-a1a8-caacf3d5b325',
    ContractDefinitionTypeID = 'f85cb6f7-33e5-4dc8-b609-ec7212301948',
    ID9 = 'ac3c307a-368f-4db8-940d-68914b26d89a',
    BuddyTypeID = 'dd3bf334-87f3-40bd-b043-682a57a8dc3a',
    SprayTypeID = 'd5f120f8-ff8c-4aac-92ea-f2b5acbe9475',
    ID12 = '0381b6a6-e901-4225-a30c-b18afc6d0ad4',
    PlayerCardTypeID = '3f296c07-64c3-494c-923b-fe692a4fa1bd',
    PlayerTitleTypeID = 'de7caa6b-adf7-4588-bbd1-143831e786c6',
  }

  export interface ItemDataItem { //
    Amount: number,
    ItemID: string,
    ItemTypeID: ItemTypeID
  }

  export interface Item {
    BasePrice: number,
    CurrencyID: string,
    DiscountPercent: number,
    DiscountedPrice: number,
    IsPromoItem: boolean,
    Item: ItemDataItem //
  }

  export interface Bundle {
    CurrencyID: string,
    DataAssetID: string,
    DurationRemainingInSeconds: number,
    ID: string,
    Items: [Item]
    WholesaleOnly: boolean
  }

  export interface FeaturedBundle {
    Bundle: Bundle,
    BundleRemainingDurationInSeconds: number,
    Bundles: [Bundle]
  }

  export interface SkinsPanelLayout {
    SingleItemOffers: string[],
    SingleItemOffersRemainingDurationInSeconds: number
  }

  export enum CostType {
    VP = '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
    RP = 'e59aa87c-4cbf-517a-5983-6e81511be9b7'
  }

  export enum CurrencyType {
    VP = '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741',
    RP = 'e59aa87c-4cbf-517a-5983-6e81511be9b7'
  }

  export interface Costs {
    [CostType.VP]?: number,
    [CostType.RP]?: number,
  }

  export interface BonusStoreOffer {
    BonusOfferID: string,
    Offer: Offer,
    DiscountPercent: number,
    DiscountCosts: Costs,
    IsSeen: boolean
  }

  export interface BonusStore {
    BonusStoreOffers: BonusStoreOffer[]
  }

  export interface Store {
    FeaturedBundle:  FeaturedBundle,
    SkinsPanelLayout: SkinsPanelLayout,
    BonusStore?: BonusStore
  }

  export interface OfferReward {
    ItemID: string,
    ItemTypeID: string,
    Quantity: number
  }

  export interface Offers {
    Offers: Offer[]
  }

  export interface Cost {
    // [Key in ClientAPI.CurrencyType]: number
  }

  export interface Offer {
    OfferID: string,
    IsDirectPurchase: boolean,
    StartDate: string,
    Cost: Costs,
    Rewards: OfferReward[]
  }
}

// etc

export interface RiotTokenResponseType {
  'access_token': string,
  "scope": string,
  "iss": string,
  "id_token": string,
  "token_type": string,
  "session_state": string,
  "expires_in": string,
  "requestedDate": string
}

export enum CurrencyID {
  RP = '85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741'
  
}

export type LanguageCode = 'en-US'|'ko-KR'|'ja-JP';
export type RegionCode = 'na'|'eu'|'ap'|'kr';