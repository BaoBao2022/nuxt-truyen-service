import cron, {ScheduledTask} from 'node-cron';
import axios from "axios";
import Comic from "../mongoose/models/comic";
import ChapterPreview from "../mongoose/models/chapter-preview";
import Chapter from "../mongoose/models/chapters";
import ChapterPage from "../mongoose/models/chapter-pages";
import ComicDrawl from "../mongoose/models/comic-drawls";

const tasks: ScheduledTask[] = [];

// Schedule get data from Weeboo API
// 53 13 * * *
tasks.push(cron.schedule('0 */2 * * *', async () => {
    const comics = await ComicDrawl.find({})

    for (let i = 0; i < comics.length; i++) {
        const comic = comics[i];
        const response = await axios.get(`/${comic.slug}/${comic._id}.json`, {
            baseURL:
                'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
            params: {
                slug: comic.slug,
            },
        });

        const c = response.data.pageProps.data.comic;
        const chapters = response.data.pageProps.data.chapters;
        const comicExist = await Comic.findOne({
            slug: comic.slug
        })

        if (!comicExist) {
            await Comic.insertMany([c], {ordered: false})

            // const chapPreview = c.chaptersRepresentData.map((chap: any) => ({
            //     ...chap,
            //     comicId: comic._id,
            //     comicSlug: comic.slug,
            // }));
            //
            // await ChapterPreview.insertMany(chapPreview);
        }

        Chapter.find({
            slug: {
                $in: chapters.map((item: any) => item.slug), // Check if item_id is one of the array values
            },
        })
            .then(async (documents) => {
                // documents is all the items that already exists
                let newChapters = chapters.filter(
                    (item: any) =>
                        !documents.find((doc) => doc.slug === item.slug),
                );

                newChapters = newChapters.map((chap: any) => ({
                    ...chap,
                    comicId: comic._id,
                    comicSlug: comic.slug,
                }));

                await Chapter.insertMany(newChapters, {ordered: false})
                await addChapterPages(newChapters, comic._id)
                console.log(`[ADD] Comic ${comic.slug} Chapters + ${newChapters.length}`)
            })
            .catch(() => {
                console.log('Error importing items.');
            });

    }

    console.log("End Job ---------------");
}))

async function addChapterPages(newChapters: any, comicId: string) {
    for (let i = 0; i < newChapters.length; i++) {
        const chapter = newChapters[i];

        const page = await ChapterPage.findOne({
            chapterSlug: chapter.slug,
        });

        if (!page) {
            const response = await axios.get(
                `/${chapter.slug}/${chapter._id}.json`,
                {
                    baseURL:
                        'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh-chapter',
                    params: {
                        slug: chapter.slug,
                    },
                },
            );

            const pages = response.data.pageProps.data.pages;
            const newChapters = pages.map((chap: any) => ({
                chapterId: chapter._id,
                chapterSlug: chapter.slug,
                ...chap,
            }));

            await ChapterPage.insertMany(newChapters);
            await axios.post('https://hooks.slack.com/services/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', {
                text: ` [CHAPTER ADD] Chapters Page + ${newChapters.length}` + ' DATA_JSON ' + ' ``` ' + JSON.stringify(newChapters) + ' ``` ' + new Date()
            })
        }
    }

}


export default tasks;
