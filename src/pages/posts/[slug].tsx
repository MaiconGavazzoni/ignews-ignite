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
  console.log(post);
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


  //console.log("Peguei sessão: ", session);
  if (!session?.activeSubscription) {
    //console.log("Redirecionar para home");
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      }
    }
  }


  const client = getPrismicClient({});

  const response = await client.getByUID('ignews-post', String(slug), {}) as any;

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  };

  return {
    props: { post }
  }

}