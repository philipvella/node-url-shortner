import type {ActionArgs, V2_MetaFunction} from "@remix-run/node";
import {AppBar, Button, Paper, TextField, Toolbar, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {Form, isRouteErrorResponse, useActionData, useRouteError} from "@remix-run/react";
import {json} from "@remix-run/node";
import shortid from "shortid";
import {db} from "~/routes/firebase";
import {addDoc, collection, getDocs} from 'firebase/firestore/lite';
import validUrl from 'valid-url';

export const meta: V2_MetaFunction = () => {
    return [
        {title: "Philip's URL Shortner (v1.0.0)"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function action({request}: ActionArgs) {
    const body = await request.formData();
    const url = `${body.get("url")}`;
    const hash = `${body.get("hash")}`;

    if (validUrl.isUri(url)) {
        const urlCol = collection(db, 'urls');
        const urlSnapshot = await getDocs(urlCol);
        const urlList = urlSnapshot.docs.map(doc => doc.data());
        const foundItem = urlList.find(c => c.short === hash);

        if (foundItem) {
            throw new Error(`hash already in use`);
        }
        const originalUrl: string = url;
        const shortUrl = hash ? hash : shortid.generate();
        await addDoc(collection(db, 'urls'), {long: originalUrl, short: shortUrl});
        return json({url: `${request.headers.get('origin')}/${shortUrl}`});
    } else {
        return json({url: `not a valid URI`});
    }
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <pre>{error.data}</pre>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <Paper sx={{margin: 2,padding: 2}} variant="outlined">
                <Typography color="red" variant="h3">Error</Typography>
                <Typography color="darkred" variant="caption">{error.message}</Typography>
                <Box color="green">
                    <pre><code style={{    whiteSpace: "break-spaces"}}>{error.stack}</code></pre>
                </Box>
            </Paper>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}


export default function Index() {
    const actionData = useActionData<typeof action>();

    return (
        <Box sx={{flexGrow: 1, textAlign: "center"}}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        URL Shortener
                    </Typography>
                </Toolbar>
            </AppBar>
            <Paper variant="outlined" sx={{padding: 3}}>
                <Form method="post">
                    <TextField fullWidth placeholder="Enter Url" name="url" required type="url" sx={{marginBottom: 2}}/>
                    <TextField fullWidth placeholder="Custom hash" name="hash" type="text" sx={{marginBottom: 2}}/>

                    <Button type="submit" variant="contained">Shorten Url</Button>
                </Form>

                <Typography variant="body1" sx={{marginTop: 2}}>
                    {actionData && (<a href={actionData.url}>{actionData.url}</a>)}
                </Typography>
            </Paper>
        </Box>

    );
}
