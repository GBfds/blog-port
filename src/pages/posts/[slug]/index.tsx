import { GetServerSideProps } from "next"
import { getPrismicClient } from "../../../services/prismic"
import {RichText} from "prismic-dom";

import styles from "./styles.module.scss"
import Head from "next/head";
import Link from "next/link";

interface PostProps{
    post: {
       slug: string;
       title: string;
       description: string;
       image: string;
       hospedagem: string | boolean;
       github: string;
       updatedAt: string;
   }
}
export default function DatailPost({post}: PostProps){
    return(
        <>
        <Head>
            <title>datalhes - Blog</title>
        </Head>
        <main className={styles.container}>
            <article className={styles.post}>
                <h1>{post.title}</h1>
                <img src={post.image} alt={post.slug} />
                <p>{post.description}</p>

                {post.hospedagem && (
                    <Link href={post.hospedagem as string} target="_blank">
                        <button>Ver o site</button>
                    </Link>
                )}
                    
                <Link href={post.github}  target="_blank">
                    <button>Ver Repositorio</button>
                </Link>     

                <time>{post.updatedAt}</time>
            </article>
        </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
    const {slug} = params;

    const prismic = getPrismicClient(req);
    const response = await prismic.getByUID("post", String(slug),{})

    if(!response){
        return{
            redirect:{
                destination: "/posts",
                permanent: false
            }
        }
    }

    const post = {
        slug: slug,
        title: response.data.title,
        description: RichText.asText(response.data.description),
        hospedagem: response.data.hospedagem.url,
        github: response.data.github.url,
        image: response.data.image.url,
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR",{
            day:"2-digit",
            month:"long",
            year:"numeric"
        })
    }

    if (post.hospedagem === undefined){
        post.hospedagem = false
    }
    

    return{
        props:{
            post
        }
    }
}