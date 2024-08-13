import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import NarcWithWhiteBackground from "../assets/narc_w_flower_white_background.png";

// experimental things
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import mdxRenderer from "astro/jsx/server.js";

const container = await AstroContainer.create();
container.addServerRenderer({ renderer: mdxRenderer });

export async function GET(context) {
    const posts = await getCollection("posts");
    const sortedPosts = Object.values(posts).sort(
        (a, b) =>
            new Date(b.data.published).valueOf() -
            new Date(a.data.published).valueOf(),
    );
    return rss({
        title: "Narcissus",
        description: "People writing about themselves for themselves",
        site: context.site,
        xmlns: {
            media: "http://search.yahoo.com/mrss/",
        },
        items: await Promise.all(
            sortedPosts.map(async (post) => {
                const { Content } = await post.render();
                const postHtml = await container.renderToString(Content);
                return {
                    title: post.data.title,
                    pubDate: post.data.pubDate,
                    description: post.data.description,
                    link: `/posts/${post.slug}/`,
                    content: sanitizeHtml(postHtml, {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
                    }),
                };
            }),
        ),
        customData: `<media:content
          type="image/png"
          width="${NarcWithWhiteBackground.width}"
          height="${NarcWithWhiteBackground.height}"
          medium="image"
          url="${context.site + NarcWithWhiteBackground.src}" />`,
    });
}
