import {useParams} from "@remix-run/react";
import fs from "fs";
import {LoaderArgs, redirect} from "@remix-run/node";

export const loader = ({params}:LoaderArgs) => {
    let urlMappings: { [index: string]: string } = {};
    try {
        const data = fs.readFileSync('public/urls.json', 'utf8');
        urlMappings = JSON.parse(data);
    } catch (error) {
        console.error('Error reading URL mappings:', error);
    }

    const originalUrl = urlMappings[`${params.linkId}`];
    if(originalUrl)
    return redirect(originalUrl);
}

export default function PostRoute() {
  return (<>Url Not found</>)
}
