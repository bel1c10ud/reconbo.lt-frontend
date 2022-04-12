import style from './AboutLayout.module.css';

export default function AboutLayout() {
  return (
    <div className={style.self}>
        <div>
          <h1>이 프로젝트에 대하여</h1>
          <p>이 프로젝트는 ‘발로란트 클라이언트 API’를 사용하여 플레이어의 상점 정보를 가져옵니다.</p>
          <p><a href="https://github.com/techchrism/valorant-api-docs">techchrism의 valorant-api-docs 레포지토리</a>를 참고하였습니다.</p>
          <p>
            웹 브라우저 환경에서 정상적인 작동을 위해 자체 구현한 로그인 API를 사용하고 있으며, 일부 API 요청은 <a href="https://developer.mozilla.org/ko/docs/Web/HTTP/CORS">CORS 정책</a>을 우회하기 위해 <a href="https://nextjs.org/docs/api-reference/next.config.js/rewrites">next.js의 rewrites</a>를 사용하여 라우팅하고 있습니다.
          </p>
          <p>소스코드는 Github를 통하여 공개되며 원한다면 언제든 로컬 환경에서 직접 빌드하여 사용하거나, vercel을 통해 직접 배포하여 사용할 수 있습니다.</p>
        </div>

        <div>
          <h2>로그인 API</h2>
          <p>서버측 headless browser를 사용하여 로그인 과정(CORS, Session Cookie)을 처리합니다.</p>
        </div>

        <div>
          <h2>라우팅되는 일부 API 요청</h2>
          <ul>
            <li>플레이어의 UUID</li>
            <li>플레이어의 상점 정보</li>
          </ul>
        </div>

 
    </div>
  )
}