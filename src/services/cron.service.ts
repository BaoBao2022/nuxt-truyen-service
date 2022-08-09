import cron, { ScheduledTask } from 'node-cron';
import axios from 'axios';
import Comic from '../mongoose/models/comic';
import ChapterPreview from '../mongoose/models/chapter-preview';
import Chapter from '../mongoose/models/chapters';
import ChapterPage from '../mongoose/models/chapter-pages';
import ComicDrawl from '../mongoose/models/comic-drawls';
import NovelDrawls from '../mongoose/models/novel/novel-drawls';
import Novel from '../mongoose/models/novel/novel';
import NovelChapter from '../mongoose/models/novel/novel-chapter';

const tasks: ScheduledTask[] = [];

// Clone novel weeboo
tasks.push(
    cron.schedule('25 10 * * *', async () => {
        console.log('---Start JOB Novel weeboo');
        const novels = await NovelDrawls.find({});

        for (let i = 0; i < novels.length; i++) {
            await new Promise((f) => setTimeout(f, 3000));

            const novel = novels[i];
            const response = await axios.get(
                `/${novel.slug}/${novel._id}.json`,
                {
                    baseURL:
                        'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/tieu-thuyet',
                    params: {
                        slug: novel.slug,
                    },
                },
            );

            const novelInfo = response.data.pageProps.data.novel;
            const chapters = response.data.pageProps.data.chapters;
            const novelExist = await Novel.findOne({
                slug: novel.slug,
            });

            if (!novelExist) {
                await Novel.insertMany([novelInfo], { ordered: false });
            }

            NovelChapter.find({
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

                    const chaps = [];
                    newChapters = newChapters.map((chap: any) => ({
                        ...chap,
                        novelId: novel._id,
                        novelSlug: novel.slug,
                    }));

                    for (
                        let newChap = 0;
                        newChap < newChapters.length;
                        newChap++
                    ) {
                        const element = newChapters[newChap];
                        const res: any = await axios.get(
                            `/${element.slug}/${element._id}.json`,
                            {
                                baseURL:
                                    'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/tieu-thuyet-chuong',
                                params: {
                                    slug: element.slug,
                                },
                            },
                        );

                        const data = res.data.pageProps.data;
                        chaps.push(data);
                    }

                    await NovelChapter.insertMany(chaps, {
                        ordered: false,
                    });

                    console.log(
                        `[ADD] Novel ${novel.slug} Chapters + ${newChapters.length}`,
                    );
                })
                .catch(() => {
                    console.log('Error importing items.');
                });
        }

        console.log('End Job ---------------');
    }),
);

// Schedule get data from Weeboo API
// 53 13 * * *
tasks.push(
    cron.schedule('0 */2 * * *', async () => {
        const comics = await ComicDrawl.find({});

        for (let i = 0; i < comics.length; i++) {
            await new Promise((f) => setTimeout(f, 3000));
            const comic = comics[i];
            const response = await axios.get(
                `/${comic.slug}/${comic._id}.json`,
                {
                    baseURL:
                        'https://weeboo.vn/_next/data/4Gs69jVc_-x-BI8xSHAfe/truyen-tranh',
                    params: {
                        slug: comic.slug,
                    },
                },
            );

            const c = response.data.pageProps.data.comic;
            const chapters = response.data.pageProps.data.chapters;
            const comicExist = await Comic.findOne({
                slug: comic.slug,
            });

            if (!comicExist) {
                await Comic.insertMany([c], { ordered: false });
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

                    await Chapter.insertMany(newChapters, { ordered: false });
                    await addChapterPages(newChapters, comic._id);
                    console.log(
                        `[ADD] Comic ${comic.slug} Chapters + ${newChapters.length}`,
                    );
                })
                .catch(() => {
                    console.log('Error importing items.');
                });
        }

        console.log('End Job ---------------');
    }),
);

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
            await axios.post(
                'https://hooks.slack.com/services/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',
                {
                    text:
                        ` [CHAPTER ADD] Chapters Page + ${newChapters.length}` +
                        ' DATA_JSON ' +
                        ' ``` ' +
                        JSON.stringify(newChapters) +
                        ' ``` ' +
                        new Date(),
                },
            );
        }
    }
}

export default tasks;
