import style from './ItemsLayout.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useExternalAPI } from '../../hooks';
import { ExternalAPI } from '../../type';
import Head from 'next/head';
import ItemCardSkeleton from '../ItemCards/ItemCardSkeleton';
import ItemCardError from '../ItemCards/ItemCardError';
import Spray from '../ItemCards/Spray';
import Skin from '../ItemCards/Skin';
import Buddy from '../ItemCards/Buddy';
import PlayerCard from '../ItemCards/PlayerCard';
import PlayerTitle from '../ItemCards/PlayerTitle';
import Button from '../Button';
import Select from '../Select';
import Hr from '../Hr';
import LanguageSelect from '../LanguageSelect';
import LoginButton from '../LoginButton';
import Footer from '../Footer';

const categoryOption: { label: string, value: keyof typeof ExternalAPI.Endpoint }[] = [
  { label: 'Weapon Skin', value: 'weapons' }, 
  { label: 'Spray', value: 'sprays' }, 
  { label: 'Buddy', value: 'buddies' }, 
  { label: 'Player Card', value: 'playerCards' }, 
  { label: 'Player Title', value: 'playerTitles' },
];

const weaponOption = [
  { label: 'All', value: 'all'},
  // { label: 'Guns', value: 'guns'},
  // { label: 'Melee', value: ''},
  // { label: 'Sidearm', value: ''},
  // { label: 'SMG', value: ''},
  // { label: 'Assault Rifle', value: ''},
  // { label: 'Sniper Rifle', value: ''},
  // { label: 'Heavy Weapon', value: ''},
];

type DataType = (ExternalAPI.Weapon|ExternalAPI.Buddy|ExternalAPI.Spray|ExternalAPI.PlayerCard|ExternalAPI.PlayerTitle)[]

export default function ItemsLayout() {
  const [category, setCategory] = useState(categoryOption[0].value);
  const [weaponFilter, setWeaponFilter] = useState('all');

  const size = 6;
  const [limit, setLimit] = useState(size);

  const fetch = useExternalAPI<DataType>(category);

  const weapons = useMemo(() => {
    const obj = { error: undefined, data: undefined, isLoading: false };
    if(fetch.error) return { ...obj, error: fetch.error }
    if(fetch.isLoading) return { ...obj, isLoading: true }
    if(fetch.data) {
      const data = fetch.data.map(el => {
        const assetPathArr =  el.assetPath.split('/');
        let value = '';
        if(assetPathArr[3] === 'Guns') value = assetPathArr[5];
        if(assetPathArr[3] === 'Melee') value = 'Melee';
        return { label: el.displayName, value: value }
      });
      return { ...obj, data: data }
    }
    else return { ...obj, error: new Error('not found weapon data') }
  }, [fetch])

  const weaponFilterRegex = useMemo(() => {
    if(weaponFilter === 'all') return new RegExp('', 'ig');
    else return new RegExp(`\/${weaponFilter}\/`, 'ig');
  }, [weaponFilter]);

  const data = useMemo(() => {
    const obj = { error: undefined, data: undefined, isLoading: false };
    if(fetch.error) return { ...obj, error: fetch.error };
    if(fetch.isLoading) return { ...obj, isLoading: true };
    if(fetch.data) {
      if(category === 'weapons') {
        let arr: ExternalAPI.Skin[] = [];
        (fetch.data as ExternalAPI.Weapon[]).forEach(weapon => weapon.skins.forEach(skin => arr = [ ...arr, skin ]))
        return { ...obj, data: arr.filter(el => el.assetPath.match(weaponFilterRegex)) }
      } else {
        return { ...obj, data: fetch.data }
      }
    } else return { ...obj, error: new Error('not found items data') }
  }, [category, fetch])

  const updateCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.currentTarget.value) 
      setCategory(e.currentTarget.value as keyof typeof ExternalAPI.Endpoint);
  };

  const updateWeaponFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.currentTarget.value) 
      setWeaponFilter(e.currentTarget.value);
  };

  useEffect(() => setLimit(size), [category, weaponFilter]);

  return (
    <>
      <Head>
        <title>Reconbo.lt | Items</title>
      </Head>
      <div className={style['self']}>
        <div className={style['title']}>ITEMS</div>
        <Select name='category' options={categoryOption} value={category} placeholder='Category' onChange={updateCategory} />
{ category === 'weapons' ? (
        <Select name='weapon' 
        options={[...weaponOption, ...weapons.data ?? []]} 
        placeholder='Weapon' 
        value={weaponFilter} 
        onChange={updateWeaponFilter}
        />
):null}
        <Hr />
        <div className={style['items-wrap']}>
{ data.error ? <ItemCardError /> : null }
{ data.isLoading ? Array.apply(null, Array(limit)).map((el, i) => <ItemCardSkeleton key={i} />) : null }
{ data.data ? data.data.slice(0, limit).map(data => {
  if(category === 'weapons') return <Skin uuid={data.uuid} />
  if(category === 'sprays') return <Spray uuid={data.uuid} />
  if(category === 'buddies') return <Buddy uuid={data.uuid} />
  if(category === 'playerCards') return <PlayerCard uuid={data.uuid} />
  if(category === 'playerTitles') return <PlayerTitle uuid={data.uuid} />
}) : null }
{ (data.data?.length ?? 0) > limit ? (
          <div className={style['limit']}>
            <Button onClick={() => setLimit(limit+size)} large>{limit} / {data.data?.length ?? '?'}</Button>
          </div>
) : null }
        </div>
        <Hr />
        <LanguageSelect />
        <LoginButton />
        <Footer />
      </div>
    </>
  )
}