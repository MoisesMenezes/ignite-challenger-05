import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi';
import Prismic from "@prismicio/client";

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  return (
    <>
      <header className={styles.postHeader}>
        <img src="/logo.svg" alt="logo" />
      </header>
      <main className={commonStyles.contentContainer}>
        <div className={styles.postContainer}>
          <div className={styles.postContent}>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de clicos de vida</p>

            <div className={styles.iconsContainer}>
              <div className={styles.iconsContent}>
                <FiCalendar size={20} />
                <p>15 Mar 2021</p>
              </div>
              <div className={styles.iconsContent}>
                <FiUser size={20} />
                <p>Joseph Oliveira</p>
              </div>
            </div>
          </div>

          <div className={styles.postContent}>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de clicos de vida</p>

            <div className={styles.iconsContainer}>
              <div className={styles.iconsContent}>
                <FiCalendar size={20} />
                <p>15 Mar 2021</p>
              </div>
              <div className={styles.iconsContent}>
                <FiUser size={20} />
                <p>Joseph Oliveira</p>
              </div>
            </div>
          </div>

          <div className={styles.postContent}>
            <h1>Como utilizar Hooks</h1>
            <p>Pensando em sincronização em vez de clicos de vida</p>

            <div className={styles.iconsContainer}>
              <div className={styles.iconsContent}>
                <FiCalendar size={20} />
                <p>15 Mar 2021</p>
              </div>
              <div className={styles.iconsContent}>
                <FiUser size={20} />
                <p>Joseph Oliveira</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(
//   //   [Prismic.predicates]
//   // );

//   return {
//     props: {}
//   }
// };
