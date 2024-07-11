import Image from "next/image";
import dynamic from 'next/dynamic';
import Head from 'next/head';
const Map = dynamic(() => import('./components/Map'), { ssr: false });
export default function Home() {
  return (
    <div>
      <Head>
        <title>Leaflet Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      </Head>
      <Map />
    </div>
  );
}
