import {useRouter} from 'next/router'
import {Container, Grid, Link, TextField, Typography} from "@material-ui/core";
import PodcastCard from "../../../src/components/PodcastCard";
import Button from "@material-ui/core/Button";
import {Backspace, Hearing, Publish, Save} from "@material-ui/icons";
import {podcast} from "../../../src/DB";

const PodcastModeration = () => {
  const router = useRouter()
  const {podcastId} = router.query

  return <Container maxWidth="xl">
    <Typography variant="h3" component="h3" align="center">
      Podcast Moderation
    </Typography>
    <Typography variant="h4" component="h4">
      Podcast #{podcast.id}
    </Typography>
    <Typography>
      See the original <Link href={podcast.hnUrl} target="_blank" rel="noopener">Hacker News story</Link>.
    </Typography>

    <form noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <TextField id="title" label="Title" variant="outlined" fullWidth value={podcast.title}/>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" startIcon={<Save/>}>Save</Button>
        </Grid>
        <Grid item xs={11}>
          <TextField id="image" label="Image" variant="outlined" fullWidth value={podcast.image.url}/>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" startIcon={<Save/>}>Save</Button>
        </Grid>
        <Grid item xs={12}>
          <TextField id="text" label="Text" multiline rows={20} fullWidth defaultValue={podcast.text}
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