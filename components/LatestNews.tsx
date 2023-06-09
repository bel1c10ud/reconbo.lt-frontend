import style from './LatestNews.module.css';
import { useMemo, useRef } from 'react';
import { usePlayValPageData } from '../hooks';
import Callout, { CalloutBody, CalloutTitle } from './Callout';
import { AsyncData, ValorantOfficialWeb } from '../type';
import Slider, { ScrollBar } from './Slider';

export default function LatestNews() {
  const pageData = usePlayValPageData();
  const contentRef = useRef<HTMLDivElement>(null);

  const selectedArticlesData = useMemo(() => {
    const result: AsyncData<ValorantOfficialWeb.Article[]> = { isLoading: false, error: undefined, data: undefined };
    if(pageData.isLoading) return { ...result, isLoading: true };
    else if(pageData.error) return { ...result, error: pageData.error };
    else if(pageData.data && pageData.data.data.contentstackHomepage.news.articles_select) return { ...result, data: pageData.data.data.contentstackHomepage.news.articles_select }
    else return { ...result, data: [] }
  }, [pageData]);

  const articlesData = useMemo(() => {
    const result: AsyncData<ValorantOfficialWeb.Article[]> = { isLoading: false, error: undefined, data: undefined };
    if(pageData.isLoading) return { ...result, isLoading: true };
    else if(pageData.error) return { ...result, error: pageData.error };
    else if(pageData.data && pageData.data.data.allContentstackArticles.nodes) return { ...result, data: pageData.data.data.allContentstackArticles.nodes }
    else return { ...result, error: new Error('invaild articlesData!') }
  }, [pageData]);

  const newsData = useMemo(() => {
    const result: AsyncData<ValorantOfficialWeb.Article[]> = { isLoading: false, error: undefined, data: undefined };
    if(selectedArticlesData.isLoading) return { ...result, isLoading: true }
    else if(selectedArticlesData.error || selectedArticlesData.data?.length === 0) { //선택된 Article이 없거나 오류가 발생했을 떄
      if(articlesData.isLoading) return { ...result, isLoading: true }
      else if(articlesData.error) return { ...result, error: articlesData.error }
      else if(articlesData.data) return { ...result, data: articlesData.data.slice(0, 3) }
      else return { ...result, error: new Error('invaild newsData: invaild articlesData!') }
    }
    else if(selectedArticlesData.data) return { ...result, data: selectedArticlesData.data }
    else return { ...result, error: new Error('invaild newsData: invaild selectedArticlesData!')}
  }, [pageData]);

  if(newsData.isLoading) return <LatestNewsSkeleton />
  else if(newsData.error || !newsData.data) return <LatestNewsError error={newsData.error?? new Error('not found newsData!')} />
  return (
    <div className={style['self']}>
      <h2 className={style['title']}>LATEST NEWS</h2>
      <div className={style['articles']} ref={contentRef}>
{ newsData.data.map(news => (
        <LatestNewsArticle key={news.id} data={news} />
))}
      </div>
      <ScrollBar contentRef={contentRef} />
    </div>
  )
}

function LatestNewsArticle(props: { 
  data: ValorantOfficialWeb.Article
}) {
  const pageData = usePlayValPageData();

  const linkUrl = useMemo(() => {
    if(props.data.article_type === 'External Link') return props.data.external_link
    else if(props.data.article_type === 'Normal article') {
      if(pageData.data && pageData.data.pageContext.language && props.data.url?.url) {
        return `https://playvalorant.com/${pageData.data.pageContext.language}${props.data.url.url}`
      }
      else return undefined
    }
    else return undefined
  }, [props.data.article_type])

  return (
    <div className={style['article']}>
      <a { ...(linkUrl? { href: linkUrl, target: '_blank' } : {}) }>
        <picture className={style['article-image']}>
          <img alt='' src={props.data.banner?.url} />
        </picture>
        <div className={style['article-title']}>
          {props.data.title}
        </div>
      </a>
    </div>
  )
}

function LatestNewsArticleSkeleton() {
  return (
    <div className={style['article']}>
      <div className={style['article-image-skeleton']}></div>
      <div className={style['article-title-skeleton']}></div>
    </div>
  )
}

function LatestNewsSkeleton() {
  return (
    <div className={style['self']}>
      <h2>LATEST NEWS</h2>
      <div className={style['articles']}>
        <LatestNewsArticleSkeleton />
        <LatestNewsArticleSkeleton />
        <LatestNewsArticleSkeleton />
      </div>
    </div>
  )
}

function LatestNewsError(props: { error: Error }) {
  return (
    <div className={style['self']}>
      <h2>LATEST NEWS</h2>
      <Callout>
        <CalloutTitle>{props.error.message?? 'unkown error!'}</CalloutTitle>
        <CalloutBody>{props.error.stack?? ''}</CalloutBody>
      </Callout>
    </div>
  )
}