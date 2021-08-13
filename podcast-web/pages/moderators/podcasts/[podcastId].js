import {Container, Grid, Link, TextField, Typography} from "@material-ui/core";
import PodcastCard from "../../../src/components/PodcastCard";
import Button from "@material-ui/core/Button";
import {Backspace, Hearing, Publish, Save} from "@material-ui/icons";
import ApiClient from "../../../src/services/ApiClient";
import {useState} from "react";
import YCHNApiClient from "../../../src/services/YCHNApiClient";

export async function getServerSideProps(context) {
  const {podcastId} = context.params

  const apiClient = ApiClient.forServerApp()
  const draftEpisode = await apiClient.getDraftEpisode(podcastId)

  return {
    props: {
      draftEpisode
    },
  }
}

const PodcastModeration = ({draftEpisode}) => {

  const hnStoryUrl = YCHNApiClient.getStoryUrl(draftEpisode.id)
  const [draftState, setDraftState] = useState(draftEpisode)

  return <Container maxWidth="xl">
    <Typography variant="h3" component="h3" align="center">
      Podcast Moderation
    </Typography>
    <Typography variant="h4" component="h4">
      Podcast #{draftState.id}
    </Typography>
    <Typography>
      See the original <Link href={hnStoryUrl} target="_blank" rel="noopener">Hacker News story</Link>.
    </Typography>

    <form noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <TextField id="title" label="Title" variant="outlined" fullWidth value={draftState.title}/>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" startIcon={<Save/>}>Save</Button>
        </Grid>
        <Grid item xs={11}>
          <TextField id="image" label="Image" variant="outlined" fullWidth value={draftState.image?.url}/>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" startIcon={<Save/>}>Save</Button>
        </Grid>
        <Grid item xs={12}>
          <TextField id="text" label="Text" multiline rows={20} fullWidth defaultValue={draftState.description}
                     variant="outlined"/>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<Hearing/>}>Pre-Listen</Button>
        </Grid>
      </Grid>
    </form>

    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item xs={4}>
        <Typography variant="h6" component="h6" color="textSecondary">Podcast Card Preview:</Typography>
      </Grid>
      <Grid item xs={8}>
        <PodcastCard/>
      </Grid>
    </Grid>

    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Button variant="contained" color="secondary" startIcon={<Backspace/>}>Discard Draft Audio</Button>
      </Grid>
      <Grid item xs={3}>
        <Button variant="contained" color="primary" startIcon={<Publish/>}>Publish Podcast</Button>
      </Grid>
    </Grid>

  </Container>
}

export default PodcastModeration