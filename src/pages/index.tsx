import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <header className={styles.postHeader}>
        <img src="/logo.svg" alt="logo" />
      </header>
      <main className={commonStyles.contentContainer}>
        <div className={styles.postContainer}>
          {postsPagination.results.map(post => (
            <Link href={`/post/${post.uid}`}  key={post.uid}>
              <div className={styles.postContent}>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>

                <div className={styles.iconsContainer}>
                  <div className={styles.iconsContent}>
                    <FiCalendar size={20} />
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div className={styles.iconsContent}>
                    <FiUser size={20} />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <a className={styles.loadPost} href="#">
          <strong>Carregar mais posts</strong>
        </a>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 3,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        parseISO(post.first_publication_date),
        'd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const nextPage = postsResponse.next_page;

  return {
    props: {
      postsPagination: {
        next_page: nextPage,
        results: posts,
      },
    },
  };
};
