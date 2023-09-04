import {json, LoaderArgs, redirect, V2_MetaFunction} from "@remix-run/node";

import {collection, getDocs} from "firebase/firestore/lite";
import {db} from "~/routes/firebase";

export const meta: V2_MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export const loader = async ({params}: LoaderArgs) => {
        const urlCol = collection(db, 'urls');
        const urlSnapshot = await getDocs(urlCol);
        const urlList = urlSnapshot.docs.map(doc => doc.data());
        const foundItem = urlList.find(c=> c.short === params.linkId);
        if(foundItem)
        return redirect( foundItem.long);

    return json({urlList})
}

export default function PostRoute() {
    return (<div>Url Not found</div>)
}
