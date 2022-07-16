import Head from 'next/head';
import styles from './styles.module.scss';
import { getPrismicClient } from '../../services/prismicio';
import { RichText } from 'prismic-dom';
import Link from 'next/link';
import { GetStaticProps } from 'next';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}


interface PostsProps {
  posts: Post[];
}




export default function Posts({ posts }: PostsProps) {

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a >
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}...</p>
              </a>
            </Link>
          ))}



        </div>
      </main>
    </>
  );

}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = getPrismicClient({ previewData });
  console.log(client);

  const pages = await client.getAllByType('ignews-post');

  console.log(pages);

  //construir os posts fakes pois não consegui acessar a API do Prismic 

  const posts = pages.map(post => {
    const firstParagraph: string = post.data.content.find(content => content.type === 'paragraph')?.text ?? '';
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: firstParagraph.split('.')[0],
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  // const posts = [
  //   {
  //     slug: "my-first-publication",
  //     title: "Test Fake",
  //     excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
  //     updatedAt: "12 de março"
  //   },
  //   {
  //     slug: "my-second-publication",
  //     title: "Test2 Fake 2",
  //     excerpt: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has",
  //     updatedAt: "13 de março"
  //   },
  // ]

  return {
    props: { posts }, // Will be passed to the page component as props
  }
}