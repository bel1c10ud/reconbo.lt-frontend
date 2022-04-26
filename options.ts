export type LanguageCode = 'en-US'|'ko-KR'|'ja-JP';

export interface LanguageOption {
  value: LanguageCode,
  label: string,
}

export const languageOptions: LanguageOption[] = [
  {
    value: 'en-US',
    label: 'English'
  },
  {
    value: 'ko-KR',
    label: '한국어'
  },
  {
    value: 'ja-JP',
    label: '日本語'
  }
];

export type RegionCode = 'na'|'eu'|'ap'|'kr';

export interface RegionOption {
  value: RegionCode,
  label: string
}

export const regionOptions: RegionOption[] = [
  {
    value: 'na',
    label: 'NA - North America'
  },
  {
    value: 'eu',
    label: 'EU - Europe'
  },
  {
    value: 'ap',
    label: 'AP - Asia Pacific'
  },
  {
    value: 'kr',
    label: 'KR - Korea'
  }
];