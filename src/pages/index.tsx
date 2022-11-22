import { getPrismicClient } from '../services/prismic';
import Prismic from "@prismicio/client";
import {RichText} from "prismic-dom";

import Head from 'next/head';
import styles from '../styles/Home.module.scss'
import { GetStaticProps } from 'next';

type Data={
  title: string;
  description: string
}

interface DataProps{
  data: Data
}

export default function Home({data}: DataProps) {
  return (
    <>
    <Head>
      <title>Home - Blog</title>
    </Head>
    <main className={styles.container}>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
    </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async ()=> {

  const prismic = getPrismicClient();
  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "home")
  ])

  const {title, description} = response.results[0].data
  
  const data = {
    title: title,
    description: RichText.asText(description),
  }

  return{
    props:{
      data
    },
    revalidate: 60*10
  }
}
