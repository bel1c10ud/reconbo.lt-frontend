import Bundle, { BundleSkeleton } from "@/components/ItemCards/Bundle";
import Slider from "@/components/Slider";
import type { ClientAPI } from "@/type";
import style from "@/components/FeaturedBundle.module.css";

interface FeaturedBundleProps {
  data: ClientAPI.FeaturedBundle;
}

export default function FeaturedBundle(props: FeaturedBundleProps) {
  return (
    <div className={style["self"]}>
      <div className={style["headline"]}>
        <div className={style["title"]}>BUNDLES</div>
      </div>
      <Slider skeleton={<BundleSkeleton />} auto>
        {props.data.Bundles.map((bundle) => (
          <Bundle key={bundle.DataAssetID} uuid={bundle.DataAssetID} />
        ))}
      </Slider>
    </div>
  );
}

function Title() {
  return <div className={style["title"]}>Featrued Bundle</div>;
}
