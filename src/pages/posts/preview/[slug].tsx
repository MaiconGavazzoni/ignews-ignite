
import { GetStaticPaths, GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from 'prismic-dom';
import { useEffect } from "react";
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

  // const client = createClient({ previewData })

  // const pages = client.getByUID('publication', String(slug), {});

  // const post = response.results.map(post => {
  //   return {
  //     slug,
  //     title: RichText.asText(post.data.title),
  //     excerpt: RichText.asHtml(post.data.content),
  //     updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
  //       day: '2-digit',
  //       month: 'long',
  //       year: 'numeric'
  //     })
  //   }
  // })

  const posts = [
    {
      slug: "my-first-publication",
      title: "Test Fake",
      content: "<h3>Lorem Ipsum is simply dummy </h3>",
      updatedAt: "12 de março"
    },
    {
      slug: "my-second-publication",
      title: "Test2 Fake 2",
      content: "<h3>Lorem Ipsum is simply dummy text text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </h3>",
      updatedAt: "13 de março"
    },
  ]

  const post = posts.find(post => post.slug == slug);




  return {
    props: { post },
    redirect: 60 * 30, // 30 minutes
  }

}