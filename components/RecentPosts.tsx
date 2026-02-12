import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import RecentPostsClient from './RecentPostsClient'

export default async function RecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('id, slug, title_en, excerpt_en, published_at, reading_time_minutes, featured_image')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const posts = (!error && data ? data : []) as Post[]

  return <RecentPostsClient posts={posts} />
}
