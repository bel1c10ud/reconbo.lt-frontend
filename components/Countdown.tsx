import { useEffect, useState } from "react";

export default function Countdown(props: { duration: number }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let time = 0;
    const task = setInterval((i) => {
      time += 1;
      setSeconds(time);
    }, 1000);
    return () => clearInterval(task);
  }, []);

  return <CountdownLayout seconds={props.duration - seconds} />;
}

function CountdownLayout(props: { seconds: number }) {
  let seconds = props.seconds;
  const day = Math.floor(seconds / 60 / 60 / 24);
  seconds = seconds % (60 * 60 * 24);
  const hour = Math.floor(seconds / 60 / 60);
  seconds = seconds % (60 * 60);
  const minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  const second = seconds;

  let times: (number | string)[] = [day, hour, minute, second];

  times = times.filter((el, i, arr) => {
    if (el === 0) {
      if (i === 0) {
        return false;
      } else {
        return arr[i - 1] !== 0;
      }
    } else {
      return true;
    }
  });

  times = times.map((el, i) => (i !== 0 ? el.toString().padStart(2, "0") : el.toString()));

  return <span>{times.join(":")}</span>;
}
