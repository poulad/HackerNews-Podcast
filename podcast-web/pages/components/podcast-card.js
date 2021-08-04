import {createStyles, makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import BookmarkBorder from "@material-ui/icons/BookmarkBorder";
import Description from "@material-ui/icons/Description";
import ReactAudioPlayer from 'react-audio-player';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 151,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
  }),
);

export default function PodcastCard() {
  const classes = useStyles();

  return <Card className={classes.root}>
    <div className={classes.details}>
      <CardContent className={classes.content}>
        <Typography component="h5" variant="h5">
          Podcast title here
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Author
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {new Date().toDateString()}
        </Typography>
      </CardContent>

      <div className={classes.controls}>
        <ReactAudioPlayer controls src="/wiki-wikipedia.wav"/>
      </div>

      <div className={classes.controls}>
        <IconButton aria-label="play/pause">
          <PlayArrowIcon className={classes.playIcon}/>
        </IconButton>
        <IconButton aria-label="bookmark">
          <BookmarkBorder/>
        </IconButton>
        <IconButton aria-label="read-along">
          <Description/>
        </IconButton>
      </div>
    </div>
    <CardMedia
      className={classes.cover}
      image="/logo.png"
      title="Launching HN Podcast"
    />
  </Card>;
}
