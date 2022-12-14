import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";
import {RichText} from "prismic-dom";
import { GetStaticProps } from "next";
import Link from "next/link";


import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io";
import Head from "next/head";
import styles from "./styles.module.scss";

type Data = {
    title: string;
    description: string;
    title_ferramentas: string;
    ferramentas: [{
        text: string
    }]
}


interface DataProps{
    data: Data
}
export default function Sobre({data}: DataProps){
    return(
        <>
        <Head>
            <title>Sobre - Blog</title>
        </Head>
        <main className={styles.container}>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <h2>{data.title_ferramentas}</h2>
            <ul>
            {data.ferramentas.map(item => (
            <li key={item.text}>{item.text}</li>
          ))}
            </ul>
            <h2>Contatos:</h2>
            <ul>
                <Link href="https://www.linkedin.com/in/gabriel-fernandes-245743220/" target="_blank">
                <li>
                    <IoLogoLinkedin size={24} color="#0E76A8"/>
                    Linkedin
                </li>
                </Link>
                <Link href="https://github.com/GBfds" target="_blank">
                <li>
                    <IoLogoGithub size={24} color="#FFB800"/>
                    Github
                </li>
                </Link>
                
            </ul>
        </main>
        </>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at("document.type", "sobre")
    ])

    const {
        title,
        description,
        title_ferramentas,
        ferramentas
    } = response.results[0].data

    const data = {
        title: title,
        description: RichText.asText(description),
        title_ferramentas: title_ferramentas,
        ferramentas: ferramentas.map(item => {
            return{
                text: item.text
            }
        })
    }
    
    return{
        props:{
            data
        },
        revalidate: 60 *10
    }
}