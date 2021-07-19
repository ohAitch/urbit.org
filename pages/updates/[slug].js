import { useRouter } from "next/router";
import {
  getPostBySlug,
  getAllPosts,
  getNextPost,
  getPreviousPost,
  formatDate,
} from "../../lib/lib";
import Head from "next/head";
import Link from "next/link";
import ErrorPage from "../404";
import Container from "../../components/Container";
import Markdown from "../../components/Markdown";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BackgroundImage from "../../components/BackgroundImage";
import SingleColumn from "../../components/SingleColumn";
import Section from "../../components/Section";
import Contact from "../../components/Contact";
import PostPreview from "../../components/PostPreview";
import { name, contact } from "../../lib/constants";
import markdownStyles from "../../styles/markdown.module.css";
import { decode } from "html-entities";

export default function Post({
  post,
  nextPost,
  previousPost,
  markdown,
  search,
}) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage />;
  }
  return (
    <Container>
      <Head>
        <title>{post.title} • Updates • urbit.org</title>
      </Head>
      <SingleColumn>
        <Header search={search} />
        <Section short narrow>
          <h1>{post.title}</h1>
          {post.author ? (
            <div className="type-ui text-gray mt-4 md:mt-8 lg:mt-10">
              {post.author}
            </div>
          ) : null}
          {post.ship ? (
            <div className="type-ui text-gray font-mono">{post.ship}</div>
          ) : null}
          <div className="type-ui text-gray mt-4 md:mt-8 lg:mt-10">
            {formatDate(new Date(post.date))}
          </div>
        </Section>
        <Section narrow className={markdownStyles["markdown"]}>
          <article
            dangerouslySetInnerHTML={{ __html: decode(markdown) }}
          ></article>
        </Section>
        <Section narrow>
          <Contact />
        </Section>
        <Section wide className="flex">
          {
            // {previousPost === null ? (
            //   <div className={"w-1/2 mr-4"} />
            // ) : (
            //   <PostPreview
            //     title="Previous Post"
            //     post={previousPost}
            //     className="mr-4 w-1/2"
            //   />
            // )}
            // {nextPost === null ? (
            //   <div className={"w-1/2 ml-4"} />
            // ) : (
            //   <PostPreview
            //     title="Next Post"
            //     post={nextPost}
            //     className="ml-4 w-1/2"
            //   />
            // )}
          }
        </Section>
      </SingleColumn>
      <Footer />
    </Container>
  );
}

//
export async function getStaticProps({ params }) {
  const nextPost =
    getNextPost(
      params.slug,
      ["title", "slug", "date", "description"],
      "updates"
    ) || null;

  const previousPost =
    getPreviousPost(
      params.slug,
      ["title", "slug", "date", "description"],
      "updates"
    ) || null;

  const post = getPostBySlug(
    params.slug,
    ["title", "slug", "date", "description", "content", "author", "ship"],
    "updates"
  );

  const markdown = await Markdown({ post });

  return {
    props: { post, markdown, nextPost, previousPost },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug", "date"], "updates");

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
