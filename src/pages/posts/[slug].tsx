import { createClient } from "@prismicio/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from 'prismic-dom';
import { getPrismicClient } from "../../services/prismicio";
import styles from './post.module.scss';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}


export default function Post({ post }: PostProps) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {

  const session = await getSession({ req });
  const { slug } = params;


  console.log("Peguei sessão: ", session);
  if (!session?.activeSubscription) {
    console.log("Redirecionar para home");
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }


  const client = getPrismicClient({});

  const response = await client.getByUID('my-first-publication', String(slug), {});
  console.log(response);
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
  // }) as PostProps;

  const posts = [
    {
      slug: "my-first-publication",
      title: "Test Fake",
      content: "<h3>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has</h3>",
      updatedAt: "12 de março"
    },
    {
      slug: "my-second-publication",
      title: "Test2 Fake 2",
      content: "<h3>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has</h3>",
      updatedAt: "13 de março"
    },
  ]

  const post = posts.find(post => post.slug == slug);

  return {
    props: { post }
  }

}