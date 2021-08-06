import {CircularProgress, Container, Grid, InputAdornment, Link, TextField, Typography} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import Button from "@material-ui/core/Button";
import {InsertLink, Save} from "@material-ui/icons";
import {AlertTitle} from "@material-ui/lab";

const state = {
  storyId: 24050980,
  storyUrl: "https://news.ycombinator.com/item?id=24050980",
}

/*TODO
 * implement a delayed appearance.
 * see https://material-ui.com/components/progress/#delaying-appearance
 */

function New() {
  return <Container maxWidth="md">
    <Typography variant="h3" component="h3" align="center">
      Create a new podcast
    </Typography>

    <form noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <TextField id="storyUrl" label="Story URL or ID" variant="outlined" fullWidth
                     InputProps={{
                       startAdornment: (
                         <InputAdornment position="start">
                           <InsertLink/>
                         </InputAdornment>
                       ),
                     }}
                     value={state.storyUrl}/>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" color="primary" startIcon={<Save/>}>Create a Draft</Button>
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
      <Link href={`./${state.storyId}`}>Edit this draft</Link>
    </strong>
      .
    </Alert>


  </Container>
}

export default New