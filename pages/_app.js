import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";
import { Chakra } from "../src/components/Chakra";
import Script from "next/script";
import Layout from "../src/components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
      <Chakra cookies={pageProps.cookies}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Chakra>
    </>
  );
}

// re-export the reusable `getServerSideProps` function
export { getServerSideProps } from "../src/components/Chakra";

export default MyApp;
