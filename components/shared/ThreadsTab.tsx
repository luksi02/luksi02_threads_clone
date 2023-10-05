import {fetchUserPosts} from "@/lib/actions/user.actions";
import {redirect} from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType } : Props ) => {
    // TODO Fetch profile threads
    let result = await fetchUserPosts(accountId);

    if(!result) redirect('/');

    return (
        <section className="mt-9 flex-col gap-10">
            {result.threads.map((thread) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === 'User'
                            ? {
                            name: result.name,
                            image: result.image,
                            id: result.id
                        } : {
                            name: thread.author.name,
                            image: thread.author.image,
                            id: thread.author.id,
                            }
                    }
                    community={thread.community} // todo
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
            ThreadsTab
        </section>
    )
}

export default ThreadsTab;
