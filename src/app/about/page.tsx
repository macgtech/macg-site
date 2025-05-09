"use client";
import Head from "next/head";

const AboutPage = () => {
  return (
    <>
      <Head>
        <title>About Us - MacG TechnoloG</title>
        <meta name="description" content="MacG TechnoloG - High-quality tech accessories with fast delivery. Buy Bluetooth speakers, fast-charge cables, and more!" />
        <meta name="keywords" content="tech accessories, Bluetooth speakers, fast charging, wireless headsets, MacG TechnoloG" />
      </Head>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">About MacG TechnoloG</h1>
        <p>Welcome to MacG TechnoloG, your one-stop shop for premium tech accessories. We specialize in providing high-quality Bluetooth speakers, fast-charge cables, wireless headsets, and more at unbeatable prices.</p>
        <p>Our mission is to offer top-notch tech accessories with fast shipping and great customer support.</p>
      </div>
    </>
  );
};

export default AboutPage;
