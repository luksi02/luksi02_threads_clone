"use server"

import {connectToDB} from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import {revalidatePath} from "next/cache";

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}



export async function createThread ({ text, author, communityId, path}: Params){
    try {
        connectToDB();

        const createdThread = await Thread.create({
            text,
            author,
            community: null,
        });

//     Update user model

        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })

        revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating new thread: ${error.message}`)
    }
}

export async function fetchPosts(pageNumber = 1, pageSize =20) {
    connectToDB();

    // calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents (top-level threads)
    const postQuery = Thread.find({ parentId: { $in: [null, undefined ] } } )
        .sort({ createdAt: 'desc'})
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
        })

    const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined ] } } )

    const posts = await postQuery.exec();

    const isNext = totalPostCount > skipAmount + posts.length;

    return { posts, isNext }
}

export async function fetchThreadById( id : string ) {
    connectToDB();

    // TODO: populate community! Population too low to maintain civilisation!
    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id id name image"
            })
            // HERE COMES THE POPULATION INCEPTION!
            .populate({
              path: 'children',
              populate: [
                  {
                      path: 'author',
                      model: User,
                      select: "_id id name parentId image"
                  },
                  {
                      path: 'children',
                      model: Thread,
                      populate: {
                          path: 'author',
                          model: User,
                          select: "_id id name parentId image"
                      }
                  }
              ]
            }).exec();

        return thread;

    } catch ( error : any ) {
        throw new Error(`Error fetching thread: ${error.message}`)
        // console.log(error)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
) {
    connectToDB();

    try {
    //     Find the original thread by its iD
        const originalThread = await Thread.findById(threadId);

        if(!originalThread) {
            throw new Error("Thread not found!")
        }

    //     create new comment using 'Thread' model
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })

    //     save new Thread-comment to DB
        const savedCommentThread = await commentThread.save();

    //     update original-thread to have/contasin/include the new comment!
        originalThread.children.push(savedCommentThread._id);

    //     save original thread:
        await originalThread.save();

        revalidatePath(path);

    } catch (error: any) {
        throw new Error(`Error adding comment to thread: ${error.message}`);
    }
}