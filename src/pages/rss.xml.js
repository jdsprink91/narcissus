import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

export async function GET(context) {
    const posts = await getCollection("posts");
    return rss({
        title: "Narcissus",
        description: "People writing about themselves for themselves",
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            pubDate: post.data.pubDate,
            description: post.data.description,
            link: `/posts/${post.slug}/`,
        })),
    });
}
