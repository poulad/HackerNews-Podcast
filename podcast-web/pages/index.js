import {Container, Grid, Link, Typography} from "@material-ui/core";
import PodcastCard from "./components/podcast-card";

function Index() {

  return <Container maxWidth="md">
    <Typography component="h3" variant="h3">
      Hello, World!
    </Typography>
    <Typography variant="subtitle1" color="textSecondary">
      <strong>Listen</strong> to the top
      &nbsp;
      <Link href="https://news.ycombinator.com/" target="_blank" rel="noopener">
        Hacker News
      </Link>
      &nbsp;
      stories of the day
    </Typography>
    <Grid container spacing={3}>
      {[...Array(10).keys()].map(n => (
        <Grid item xs={12} key={n}>
          <PodcastCard/>
        </Grid>
      ))}
    </Grid>
  </Container>
}

export default Index