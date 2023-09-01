import type {ActionArgs, V2_MetaFunction} from "@remix-run/node";
import {AppBar, Button, Paper, TextField, Toolbar, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {Form, useActionData} from "@remix-run/react";
import {json} from "@remix-run/node";
import shortid from "shortid";
import fs from "fs";
import 'dotenv/config'

export const meta: V2_MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

const publicPath = `${process.env.PUBLIC_PATH}urls.json`

export async function action({request}: ActionArgs) {
    let urlMappings: { [index: string]: string } = {};
    try {
        const data = fs.readFileSync(publicPath, 'utf8');
        urlMappings = JSON.parse(data);
    } catch (error) {
        console.error('Error reading URL mappings:', error);
    }

    const body = await request.formData();
    const url = body.get("url");

    const originalUrl: string = `${url}`;
    const shortUrl = shortid.generate();
    urlMappings[shortUrl] = originalUrl;
    fs.writeFileSync(publicPath, JSON.stringify(urlMappings), 'utf8');

    return json({url: `${request.headers.get('origin')}/l/${shortUrl}`});
}


export default function Index() {
    const data = useActionData<typeof action>();
    console.log({data});
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        URL Shortener
                    </Typography>
                </Toolbar>
            </AppBar>
            <Paper variant="outlined" sx={{padding: 3}}>
                <Form method="post">
                    <TextField fullWidth label="Enter Url" name="url" required type="url"/>
                    <Button type="submit" variant="contained">Shorten</Button>
                </Form>
            </Paper>
            {data && (<a href={data.url}>{data.url}</a>)}
        </Box>

    );
}