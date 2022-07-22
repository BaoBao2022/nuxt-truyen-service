import cron, {ScheduledTask} from 'node-cron';
import ReadManga from '../mongoose/models/read.manga';
import ChapterList from '../mongoose/models/chapter.list';
import MangaSchema from '../mongoose/models/manga';
import NtModel from '../models/Nt.model';
import {resolve} from 'path';

const baseUrl = process.env.NT_SOURCE_URL as string | 'ntc';
const Nt = NtModel.Instance(baseUrl);
const tasks: ScheduledTask[] = [];

tasks.push(
    // 0 */2 * * *
    cron.schedule('02 08 * * *', async () => {
        // Run cron every 1 hour
        console.log('Start cron tab manga update first 10 pages');
        const limit = 10;
        let page = 1;

        const mangas = [];
        for (const i of Array(limit).keys()) {
            const res = await Nt.getNewUpdatedManga(page);
            for (const manga of res.mangaData) {
                mangas.push(manga);
            }

            page++;
        }

        let x = 0;
        for (const manga of mangas) {
            const res = await Nt.getMangaDetail(manga.slug);

            const filter = {
                slug: manga.slug,
            };

            const updateAtStr = res.updatedAt
                .replace('[Cập nhật lúc:', '')
                .replace(']', '');
            const dateFormat = updateAtStr.replace(' ', '/').split('/');
            const timeStamp = new Date(
                `${dateFormat[0]} ${dateFormat[3]}/${dateFormat[2]}/${dateFormat[1]}`,
            ).getTime();

            const data = {
                type: 'truyen-tranh',
                name: manga.name,
                status: manga.status,
                author: manga.author,
                review: manga.review,
                otherName: res.otherName,
                thumbnail: res.thumbnail,
                updatedAt: manga.updatedAt,
                updated: timeStamp,
                view: res.view,
                follow: res.follow,
                comment: manga.comment,
                slug: manga.slug,
                genres: res.genres,
                chapSuggests: manga.chapSuggests,
                chapterList: res.chapterList,
            };

            const found = await MangaSchema.findOne(filter);
            if (found) {
                console.log("found")
                await MangaSchema.updateOne(filter, {
                    updated: timeStamp,
                    updatedAt: manga.updatedAt,
                    comment: manga.comment,
                    follow: manga.follow,
                    view: manga.view,
                    chapterList: res.chapterList,
                    status: manga.status,
                    review: manga.review,
                    author: manga.author,
                    genres: res.genres,
                });
            }

            if (!found) {
                console.log("!found")
                MangaSchema.insertMany([data]);
            }
        }

        console.log('End cron tab manga update first 10 pages');
    }),
);

export default tasks;
