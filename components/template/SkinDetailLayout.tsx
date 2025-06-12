import Head from "next/head";
import Image from "next/image";
import { useState, useMemo } from "react";
import type { MouseEvent, MouseEventHandler } from "react";
import { RequiredLoginCallout } from "@/components/Callout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Price from "@/components/Price";
import VideoPopup from "@/components/VideoPopup";
import { usePopupStore } from "@/store";
import type { AsyncData, AuthObjType, ClientAPI } from "@/type";
import { ExternalAPI } from "@/type";
import style from "@/components/template/SkinDetailLayout.module.css";

interface SkinDetailLayoutProps {
  auth: AuthObjType;
  data: {
    externalAPISkin: ExternalAPI.Skin;
    levelIndex?: number;
    chromaIndex?: number;
    contentTier?: ExternalAPI.ContentTier;
    offer?: AsyncData<ClientAPI.Offer>;
  };
}

export default function SkinDetailLayout(props: SkinDetailLayoutProps) {
  const [chromaIndex, setChromaIndex] = useState(props.data.chromaIndex ?? 0);
  const [levelIndex, setLevelIndex] = useState(props.data.levelIndex ?? 0);

  const previewImage = useMemo(() => {
    if (props.data.externalAPISkin.chromas[chromaIndex].displayIcon) {
      return {
        uri: props.data.externalAPISkin.chromas[chromaIndex].displayIcon,
        description: props.data.externalAPISkin.chromas[chromaIndex].displayName,
      };
    } else if (props.data.externalAPISkin.chromas[chromaIndex].fullRender) {
      return {
        uri: props.data.externalAPISkin.chromas[chromaIndex].fullRender,
        description: props.data.externalAPISkin.chromas[chromaIndex].displayName,
      };
    } else if (props.data.externalAPISkin.displayIcon) {
      return {
        uri: props.data.externalAPISkin.displayIcon,
        description: props.data.externalAPISkin.displayName,
      };
    } else {
      return undefined;
    }
  }, [props.data.externalAPISkin, chromaIndex]);

  return (
    <>
      <Head>
        <title>{props.data.externalAPISkin.displayName}</title>
      </Head>
      <Header />
      <div className={style["self"]} data-tier={props.data.contentTier?.devName}>
        <div className={style["title"]}>
          <div className={style["content-tier"]}>
            <ContentTier data={props.data.contentTier} />
          </div>
          <div className={style["display-name"]}>{props.data.externalAPISkin.displayName}</div>
        </div>
        <div className={style["preview"]}>
          <PreviewImage src={previewImage?.uri} />
          <PreviewDescription>{previewImage?.description}</PreviewDescription>
        </div>
        {props.data.offer?.data && (
          <div className={style["option"]}>
            <div className={style["option-label"]}>PRICE</div>
            {props.auth.isValid ? (
              <div className={style["price"]}>
                <Price offer={props.data.offer} />
              </div>
            ) : (
              <RequiredLoginCallout />
            )}
          </div>
        )}
        <div className={style["option"]}>
          <div className={style["option-label"]}>CHROMA</div>
          <Chromas
            data={props.data.externalAPISkin.chromas}
            setFunc={setChromaIndex}
            selectedIndex={chromaIndex}
          />
        </div>
        <div className={style["option"]}>
          <div className={style["option-label"]}>LEVEL</div>
          <Levels
            data={props.data.externalAPISkin.levels}
            setFunc={setLevelIndex}
            selectedIndex={levelIndex}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}

interface PreviewImageProps {
  src?: string;
  alt?: string;
}

function PreviewImage(props: PreviewImageProps) {
  if (!props.src || props.src.trim().length < 1)
    return <div className={style["preview-image-skeleton"]}></div>;
  else
    return (
      <div className={style["preview-image"]}>
        <img src={props.src} alt={props.alt} />
      </div>
    );
}

interface PreviewDescriptionProps {
  children?: string | string[];
}

function PreviewDescription(props: PreviewDescriptionProps) {
  if (!props.children) return <div className={style["preview-description-skeleton"]}></div>;
  else return <div className={style["preview-description"]}>{props.children}</div>;
}

interface ChromasProps {
  data?: ExternalAPI.SkinChroma[];
  setFunc: Function;
  selectedIndex: number;
}

function Chromas(props: ChromasProps) {
  if (!props.data) {
    return (
      <div className={style["chromas"]}>
        <ChromaSkeleton />
      </div>
    );
  } else {
    return (
      <div className={style["chromas"]}>
        {props.data.map((chroma, index) => (
          <Chroma
            key={chroma.uuid}
            index={index}
            data={chroma}
            onClick={() => props.setFunc(index)}
            selected={index === props.selectedIndex}
          />
        ))}
      </div>
    );
  }
}

interface ChromaProps {
  index: number;
  data: ExternalAPI.SkinChroma;
  onClick: MouseEventHandler;
  selected?: boolean;
}

function Chroma(props: ChromaProps) {
  return (
    <div
      className={style["chroma"]}
      data-index={props.index}
      data-selected={props.selected}
      onClick={props.onClick}
    >
      {props.data.swatch ? (
        <Image
          className={style["chroma-swatch"]}
          src={props.data.swatch}
          width={40}
          height={40}
          alt={props.data.displayName}
          title={props.data.displayName}
        />
      ) : (
        <span className={style["chroma-swatch"]} title={props.data.displayName}>
          ?
        </span>
      )}
    </div>
  );
}

function ChromaSkeleton() {
  return (
    <div className={style["chroma"]} data-selected="true">
      <span className={style["chroma-swatch"]}></span>
    </div>
  );
}

interface LevelsProps {
  data?: ExternalAPI.SkinLevel[];
  setFunc: Function;
  selectedIndex: number;
}

function Levels(props: LevelsProps) {
  if (!props.data) {
    return (
      <div className={style["levels"]}>
        <LevelSkeleton />
      </div>
    );
  } else {
    return (
      <div className={style["levels"]}>
        {props.data.map((level, index) => (
          <Level
            key={level.uuid}
            index={index}
            data={level}
            onClick={() => props.setFunc(index)}
            selected={index === props.selectedIndex}
          />
        ))}
      </div>
    );
  }
}

interface LevelProps {
  index: number;
  data: ExternalAPI.SkinLevel;
  onClick: MouseEventHandler;
  selected?: boolean;
}

function Level(props: LevelProps) {
  const popup = usePopupStore((state) => state.popup);
  const setPopup = usePopupStore((state) => state.setPopup);

  const levelItemType = useMemo(() => {
    const typeStr: string | undefined | null = props.data.levelItem;
    const typePrefix = "EEquippableSkinLevelItem::";
    const typeReg = new RegExp(/^(EEquippableSkinLevelItem::)\w+/, "ig");

    if (!typeStr) return "Default";
    else if (typeStr === ExternalAPI.SkinLevelItemType.VFX) return "VFX";
    else if (typeStr === ExternalAPI.SkinLevelItemType.ANIMATION) return "Animation";
    else if (typeStr === ExternalAPI.SkinLevelItemType.FINISHER) return "Finisher";
    else if (typeStr === ExternalAPI.SkinLevelItemType.KILL_EFFECT) return "Kill Effect";
    else if (typeStr.match(typeReg))
      return typeStr
        .split(typePrefix)[1]
        .replace(new RegExp(/([a-z])([A-Z])/, "gm"), "$1 $2")
        .trim();
    else return <span title={typeStr}>Unknown</span>;
  }, [props.data]);

  function onClickLevel(e: MouseEvent) {
    if (props.onClick) {
      props.onClick(e);
    }

    if (popup.visiable) {
      setPopup({
        ...popup,
        component: undefined,
      });
    }

    if (props.data.streamedVideo) {
      setPopup({
        visiable: true,
        component: <VideoPopup src={props.data.streamedVideo} />,
      });
    }
  }

  return (
    <div className={style["level"]} onClick={onClickLevel} data-selected={props.selected}>
      <div>LEVEL {props.index + 1}</div>
      <div className={style["level-item-type"]}>{levelItemType}</div>
    </div>
  );
}

function LevelSkeleton() {
  return (
    <div className={style["level-skeleton"]}>
      <div className={style["level-skeleton-title"]}></div>
      <div className={style["level-skeleton-type"]}></div>
    </div>
  );
}

interface ContentTierProps {
  data?: ExternalAPI.ContentTier;
}

function ContentTier(props: ContentTierProps) {
  if (props.data)
    return <Image src={props.data.displayIcon} width={40} height={40} alt={props.data.devName} />;
  else return <Image src="/svg/question-mark.svg" width={40} height={40} alt="unknown tier" />;
}
