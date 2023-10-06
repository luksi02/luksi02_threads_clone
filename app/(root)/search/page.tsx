import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {fetchUser, fetchUsers} from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";

import {profileTabs} from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import UserCard from "@/components/cards/UserCard";
// import PostThread from "@/components/forms/PostThread";

const Page = async () => {

    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(user.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    // Fetch users
    const result = await fetchUsers({
        userId: user.id,
        searchString: '',
        pageNumber: 1,
        pageSize: 25,
    });


    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

        {/*    SearchBar*/}

            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className="no-result">No users!</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}

            </div>

        </section>
        // <div>
        //     <h1 className="text-light-1">
        //         "SEARCH PAGE" - WORK IN PROGRESS! WORK WORK WORK!
        //     </h1>
        // </div>
    )
}

export default Page;