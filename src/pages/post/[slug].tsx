import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import  Head  from "next/head";
import Header from '../../components/Header';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import styles from './post.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import commonStyles from '../../styles/common.module.scss';
import { FormateDate } from '../../utils/formateDate';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();
  const totalWords = post.data.content.reduce((total, contentItem) => {
    total += contentItem.heading.split(" ").length;

    const words = contentItem.body.map(item => item.text.split(" ") .length);
    words.map(word => (total += word));
    return total;
  },0)

  const readTime = Math.ceil(totalWords / 200);


  if(router.isFallback) {
    return <h1>Carregando...</h1>
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | SpaceTraveling</title>
      </Head>
      <Header />
      <div className={styles.banner}>
        <img src={post?.data.banner.url} alt="banner" />
      </div>
      <div className={commonStyles.contentContainer}>
        <main className={styles.container}>
          <h1>{post?.data.title}</h1>
          <div className={styles.informationContainer}>
            <div className={styles.informationContent}>
              <FiCalendar size={20} />
              <p>{FormateDate(post?.first_publication_date)}</p>
            </div>
            <div className={styles.informationContent}>
              <FiUser size={20} />
              <p>{post?.data.author}</p>
            </div>
            <div className={styles.informationContent}>
              <FiClock size={20} />
              <p>{`${readTime} min`}</p>
            </div>
          </div>

          {post?.data.content.map(content => (
            <article className={styles.content} key={content.heading}>
              <h2>{content.heading}</h2>

              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </article>
          ))}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const post = await prismic.query([
    Prismic.predicates.at('document.type', 'posts'),
  ]);

  const paths = post.results.map(post => {
    return {
      params: {
        slug: post.uid
      }
    }
  })

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});
  const content = response.data.content.map(content => {
    return {
      heading: content.heading,
      body: [...content.body],
    };
  });

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: content,
    },
  };

  return {
    props: {
      post,
    }
  };
};
