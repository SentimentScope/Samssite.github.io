import Link from 'next/link';
import { Suspense } from 'react';
import ViewCounter from './view-counter';
import { getViewsCount } from 'app/db/queries';
import { getBlogPosts } from 'app/db/blog';

export const metadata = {
  title: 'Blog',
  description: 'Information about my projects',
};

export default function BlogPage() {
  let allBlogs = getBlogPosts();

  return (
    <section>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        Latest posts
      </h1>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-row my-3">
              <div className="flex flex-row w-full">
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight float-left">
                {post.metadata.title}
              </p>
              </div>
              <div className="w-full flex justify-end">
              <Suspense fallback={<p className="h-6" />}>
                <Views slug={post.slug} />
              </Suspense>
              <img src={post.metadata.image} className='rounded-full w-12 h-12 float-right' />
              </div>
            </div>
          </Link>
        ))}
    </section>
  );
}

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();

  return <ViewCounter allViews={views} slug={slug} />;
}
