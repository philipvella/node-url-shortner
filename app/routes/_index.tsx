import type {ActionArgs, V2_MetaFunction} from "@remix-run/node";
import {AppBar, Button, Paper, TextField, Toolbar, Typography} from "@mui/material";
import {Box} from "@mui/system";
import {Form, useActionData} from "@remix-run/react";
import {json} from "@remix-run/node";
import shortid from "shortid";
import {db} from "~/routes/firebase";
import {addDoc, collection} from 'firebase/firestore/lite';

export const meta: V2_MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export async function action({request}: ActionArgs) {
    const body = await request.formData();
    const url = body.get("url");

    const originalUrl: string = `${url}`;
    const shortUrl = shortid.generate();

    const docRef = await addDoc(collection(db, 'urls'), {long: originalUrl, short: shortUrl});
    console.log("Document written with ID: ", docRef.id);

    return json({url: `${request.headers.get('origin')}/${shortUrl}`});


}

export default function Index() {
    const actionData = useActionData<typeof action>();
    return (
        <Box sx={{flexGrow: 1, textAlign:"center"}}>
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

                    <Button type="submit" variant="contained">Shorten Url</Button>
                </Form>

                <Typography variant="body1"  sx={{marginTop: 2}}>
                    {actionData && (<a href={actionData.url}>{actionData.url}</a>)}
                </Typography>
            </Paper>
        </Box>

    );
}