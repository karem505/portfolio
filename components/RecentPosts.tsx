import { getCornerstonePosts } from '@/lib/blog'
import RecentPostsClient from './RecentPostsClient'

// Surface the curated, indexable ("cornerstone") posts on the homepage. The
// homepage carries the most authority on the domain, so linking it to 9 of the
// posts we actually want ranked is the cheapest crawl-equity transfer available.
export default async function RecentPosts() {
  const posts = await getCornerstonePosts(9)

  return <RecentPostsClient posts={posts} />
}
