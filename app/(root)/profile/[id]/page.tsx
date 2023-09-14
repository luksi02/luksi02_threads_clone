import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {fetchUser} from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
// import PostThread from "@/components/forms/PostThread";

const Page = async ({ params } : { params: { id: string}}) => {

    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUser(params.id);

    if(!userInfo?.onboarded) redirect('/onboarding');

    return (
        <section>
            <ProfileHeader />
        </section>
    )
}

export default Page;