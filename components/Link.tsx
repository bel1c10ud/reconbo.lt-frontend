import OriginalLink from "next/link";
import type { MouseEvent } from "react";

export default function Link(props: React.ComponentProps<typeof OriginalLink>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if ((window as any).ReactNativeWebView) {
      event.preventDefault();

      (window as any).ReactNativeWebView.postMessage(
        JSON.stringify({
          type: "open-url",
          url: props.href,
        }),
      );
    }
  };

  return <OriginalLink {...props} onClick={handleClick} />;
}
