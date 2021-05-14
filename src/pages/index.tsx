import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { useState } from 'react';
import { FormateDate } from '../utils/formateDate';
import  Head  from "next/head";

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

  const postFormated = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date:FormateDate(post.first_publication_date),
    };
  });

  const [post, setPosts] = useState<Post[]>(postFormated);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = async () => {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }

    const postResult = await fetch(`${nextPage}`).then(response => {
      return response.json();
    });

    setNextPage(postResult.next_page);
    setCurrentPage(postResult.page);

    const newPost = postResult.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: FormateDate(post.first_publication_date),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...post, ...newPost]);
  };

  return (
    <>
      <Head>
        <title> Home | SpaceTraveling</title>
      </Head>

      <header className={styles.postHeader}>
        <img src="/logo.svg" alt="logo" />
      </header>
      <main className={commonStyles.contentContainer}>
        <div className={styles.postContainer}>
          {post.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
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
        {nextPage && (
          <button
            className={styles.loadPost}
            type="button"
            onClick={handleNextPage}
          >
            <strong>Carregar mais posts</strong>
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const nextPage = postsResponse.next_page;

  const postsPagination = {
    next_page: nextPage,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};
