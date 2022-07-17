
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from 'prismic-dom';
import { useEffect } from "react";
import { getPrismicClient } from "../../../services/prismicio";
import styles from '../post.module.scss';

interface PostPreview {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}


export default function PostPreview({ post }: PostPreview) {

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {


  const { slug } = params;

  const client = getPrismicClient({});

  const response = await client.getByUID('ignews-post', String(slug), {}) as any;
  const cut: [] = response.data.content;


  const content = cut.map((dado: any) => {
    const texto = dado.text.split('\n', 2)
    return {
      ...dado,
      text: texto
    }
  });

  //console.log("Cortada", content);
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };



  return {
    props: { post },
    redirect: 60 * 30, // 30 minutes
  }

}