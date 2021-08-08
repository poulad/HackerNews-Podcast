import {CircularProgress, Container, Grid, InputAdornment, Link, TextField, Typography} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Button from "@material-ui/core/Button";
import {InsertLink, Save} from "@material-ui/icons";
import {AlertTitle} from "@material-ui/lab";
import {useState} from "react";
import ApiClient from "../../../src/services/ApiClient";

/*TODO
 * implement a delayed appearance.
 * see https://material-ui.com/components/progress/#delaying-appearance
 */

function getStoryIdFromUrl(url) {
  const idPart = url.substring("https://news.ycombinator.com/item?id=".length)
  return parseInt(idPart)
}


function New() {
  const [storyUrl, setStoryUrl] = useState("https://news.ycombinator.com/item?id=24050980");

  const createDraft = async (e) => {
    await ApiClient.createNewDraftEpisode(getStoryIdFromUrl(storyUrl))
  }

  return <Container maxWidth="md">
    <Typography variant="h3" component="h3" align="center">
      Create a new podcast
    </Typography>

    <form noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <TextField id="storyUrl" label="Story URL or ID" variant="outlined" fullWidth
                     InputProps={{startAdornment: (<InputAdornment position="start"> <InsertLink/> </InputAdornment>)}}
                     value={storyUrl}
                     onChange={e => setStoryUrl(e.target.value)}/>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" startIcon={<Save/>} onClick={createDraft}>Create a Draft</Button>
        </Grid>
      </Grid>
    </form>

    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item xs={4}>
        <CircularProgress/>
      </Grid>
    </Grid>

    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      A podcast draft is created for this story. — <strong>
      <Link href={`./${getStoryIdFromUrl(storyUrl)}`}>Edit this draft</Link>
    </strong>
      .
    </Alert>


  </Container>
}

export default New