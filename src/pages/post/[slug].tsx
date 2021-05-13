import { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';

import commonStyles from '../../styles/common.module.scss';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import styles from './post.module.scss';

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
  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner" />
      </div>
      <div className={commonStyles.contentContainer}>
        <main className={styles.container}>
          <h1>{post.data.title}</h1>
          <div className={styles.informationContainer}>
            <div className={styles.informationContent}>
              <FiCalendar size={20} />
              <p>{post.first_publication_date}</p>
            </div>
            <div className={styles.informationContent}>
              <FiUser size={20} />
              <p>{post.data.author}</p>
            </div>
            <div className={styles.informationContent}>
              <FiClock size={20} />
              <p>4 min</p>
            </div>
          </div>

          {post.data.content.map(content => (
            <div className={styles.content} key={content.heading}>
              <h2 >{content.heading}</h2>

              <div  dangerouslySetInnerHTML={{ __html: content.body[0].text }}/>
            </div>
          ))}
        </main>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [
      {params: {slug: "react-hooks-como-utilizar"}}
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params;

  const response = await prismic.getByUID('posts', String(slug), {});
  const content = response.data.content.map(content => {
    return {
      heading: content.heading,
      body: [{ text: RichText.asHtml(content.body) }],
    };
  });

  const post = {
    first_publication_date: format(
      parseISO(response.first_publication_date),
      'd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content,
    },
  };

  return {
    props: { post },
  };
};
