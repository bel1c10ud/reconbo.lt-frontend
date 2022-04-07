import axios from 'axios';
import { useEffect, useState } from 'react';
import { SkinDataType } from '../type';
import style from './Skin.module.css';

export default function Skin(props: {
  uuid: string
}) {
  const [skinData, setSkinData] = useState<undefined|SkinDataType|Error>(undefined)

  function initFetch() {
    reqSkinData(props.uuid)
    .then(res => setSkinData(res.data))
    .catch(error => setSkinData(error));
  }

  useEffect(initFetch, []);

  if(skinData === undefined)  return <SkinLoading />
  else if(skinData.constructor === Error) return <SkinError />
  else  return <SkinLayout skinData={skinData as SkinDataType} />
}

async function reqSkinData(uuid: string) {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://valorant-api.com/v1/weapons/skinlevels/${uuid}`,
      params: { language: 'ko-KR' }
    });

    if(res.data) {
      return res.data;
    } else {
      return new Error('not found skin data from api!');
    }
  } catch(error) {
    return error;
  }
}

function SkinLayout(props: {
  skinData: SkinDataType
}) {
  return (
    <div className={style.self}>
      <div className={style.ratio}>
        <div className={style.content}>
          <div className={style.image}>
            <img alt={`${props.skinData.displayName} skin image`} src={props.skinData.displayIcon} />
          </div>
          <div className={style.name}>
            {props.skinData.displayName}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkinLoading() {
  return (
    <div>loading</div>
  )
}

function SkinError() {
  return (
    <div>Error</div>
  )
}