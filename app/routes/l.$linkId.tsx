import fs from "fs";
import {LoaderArgs, redirect} from "@remix-run/node";

import 'dotenv/config'
const publicPath = `${process.env.PUBLIC_PATH}urls.json`
export const loader = ({params}:LoaderArgs) => {
    let urlMappings: { [index: string]: string } = {};
    try {
        const data = fs.readFileSync(publicPath, 'utf8');
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
