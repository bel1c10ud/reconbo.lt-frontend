import { ClientAPI } from '../type';
import Bundle, { BundleSkeleton } from './ItemCards/Bundle';
import style from './FeaturedBundle.module.css';
import Slider from './Slider';

interface FeaturedBundleProps {
  data: ClientAPI.FeaturedBundle
}

export default function FeaturedBundle(props: FeaturedBundleProps) {
  return (
    <div className={style['self']}>
      <div className={style['headline']}>
        <div className={style['title']}>BUNDLES</div>
      </div>
      <Slider skeleton={<BundleSkeleton />} auto>
{ props.data.Bundles.map(bundle => (
        <Bundle key={bundle.DataAssetID} uuid={bundle.DataAssetID} />
))}
      </Slider>
    </div>
  )
}

function Title() {
  return <div className={style['title']}>Featrued Bundle</div>
}