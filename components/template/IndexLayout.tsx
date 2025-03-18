import Head from "next/head";
import { ThisProjectUnofficial } from "@/components/Callout";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LatestEpisodeOrAct from "@/components/LatestEpisodeOrAct";
import LatestNews from "@/components/LatestNews";
import style from "@/components/template/IndexLayout.module.css";

export default function IndexLayout() {
  return (
    <>
      <Head>
        <title>Reconbo.lt</title>
      </Head>
      <Header />
      <div className={style["self"]}>
        <div className={style["intro"]}>
          <ThisProjectUnofficial />
          <Hero />
        </div>
        <Features />
      </div>
      <Footer />
    </>
  );
}
