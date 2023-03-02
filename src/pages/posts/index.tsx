import { GetServerSideProps } from "next";
import { getPrismicClient } from "../../services/prismic";
import Prismic from "@prismicio/client";

import {FiChevronLeft,FiChevronsLeft, FiChevronRight,FiChevronsRight} from "react-icons/fi";
import styles from "./styles.module.scss";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

type Posts= {
    slug: string;
    baner: string;
    title: string;
    description: string;
    updatedtAt: string
}

interface PostsProps{
    posts: Posts[];
    page: string;
    totalPage: string
}

export default function Posts({posts : postsBlog, page, totalPage}: PostsProps){

    const [currentPage, setCurrentPage] = useState(Number(page))
    const [posts, setPosts] = useState(postsBlog || [])

    async function reqPosts(pageNumber:Number) {
        const prismic = getPrismicClient();

        const response = prismic.query([
            Prismic.Predicates.at("document.type", "post")
        ],{
            orderings: "[document.last_publication_date desc]",
            fetch: ["post.title", "post.description", "post.baner"],
            pageSize: 3,
            page: String(pageNumber)
        }) 

        return response;
    }

    async function navigatePage(pageNumber: number){
        const response = await reqPosts(pageNumber)

        if (response.results.length === 0){
            return;
        }
        
        const getPosts = response.results.map(item => {
            return{
                slug: item.uid,
                baner: item.data.baner.url,
                title: item.data.title,
                description: item.data.description.find(content => content.type === "paragraph")?.text ?? "",
                updatedtAt: new Date(item.last_publication_date).toLocaleDateString("pt-BR",{
                    day:"2-digit",
                    month: "long",
                    year: "numeric"
                })
            }
        })

        setCurrentPage(pageNumber);
        setPosts(getPosts);

    }

    return(
        <>
        <Head>
            <title>Posts - Blog</title>
        </Head>
        <main className={styles.container}>
            {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
                <article key={post.slug} className={styles.post}>
                    <div >
                        <img className={styles.img} src={post.baner} alt="react" />
                    </div>
                    <div className={styles.description}>
                        <h1>{post.title}</h1>
                        <p>{post.description}</p>
                    </div>
                </article>
            </Link>
            ))}

            <div className={styles.buttonsNavigate}>
                <div>
                {currentPage >= 2 && (
                    <div className={styles.left}>
                        <button onClick={() => navigatePage(1)}>
                            <FiChevronsLeft size={25}/>
                        </button>
                        <button onClick={() => navigatePage(currentPage-1)}>
                            <FiChevronLeft size={25}/>
                        </button>
                    </div>
                )}
                </div>
                <div>
                {currentPage < Number(totalPage) && (
                    <div className={styles.rigth}>
                        <button onClick={() => navigatePage(currentPage + 1)}>
                            <FiChevronRight size={25}/>
                        </button>
                        <button onClick={() => navigatePage(Number(totalPage))}>
                            <FiChevronsRight size={25}/>
                        </button>
                    </div>
                )}
                </div>
            </div>
        </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async () =>{
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at("document.type", "post")
    ],{
        orderings: "[document.last_publication_date desc]",
        fetch: ["post.title", "post.description", "post.baner"],
        pageSize: 3
    })

    const posts = response.results.map(item => {
        return{
            slug: item.uid,
            baner: item.data.baner.url,
            title: item.data.title,
            description: item.data.description.find(content => content.type === "paragraph")?.text ?? "",
            updatedtAt: new Date(item.last_publication_date).toLocaleDateString("pt-BR",{
                day:"2-digit",
                month: "long",
                year: "numeric"
            })
        }
    })
    

    return{
        props:{
            posts,
            page: response.page,
            totalPage: response.total_pages
        }
    }
}