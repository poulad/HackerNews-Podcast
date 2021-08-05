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
import {podcast} from "../DB";
import {Link} from "@material-ui/core";

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
          {podcast.title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          By @
          <Link href={`https://news.ycombinator.com/user?id=${podcast.author}`} target="_blank" rel="noopener">
            {podcast.author}
          </Link>
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {podcast.publishedAt.toDateString()}
        </Typography>
      </CardContent>

      <div className={classes.controls}>
        <ReactAudioPlayer controls src={podcast.audio.url}/>
      </div>

      <div className={classes.controls}>
        <IconButton aria-label="play/pause">
          <PlayArrowIcon className={classes.playIcon}/>
        </IconButton>
        <IconButton aria-label="bookmark">
          <BookmarkBorder/>
        </IconButton>
        <IconButton aria-label="read-along">
          <Link href={podcast.hnUrl} target="_blank" rel="noopener"><Description/></Link>
        </IconButton>
      </div>
    </div>
    <CardMedia className={classes.cover} image={podcast.image.url} title="Launching HN Podcast"/>
  </Card>;
}
