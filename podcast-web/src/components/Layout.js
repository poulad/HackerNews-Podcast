import CssBaseline from '@material-ui/core/CssBaseline';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, BottomNavigation, IconButton, Link, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Image from "next/image"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Layout({children}) {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Hacker News Podcast</title>
      </Head>

      <CssBaseline/>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link href="/" color="inherit">Hacker News Podcast</Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <main>{children}</main>
      <footer className={styles.footer}>
        <Link href="/moderators/podcasts/24050980">Moderators Dashboard</Link>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank" rel="noopener noreferrer">
          Powered by{" "}
          <Image width="75" height="50" src="/vercel.svg" alt="Vercel Logo" className={styles.logo}/>
        </a>
      </footer>
    </>
  )
}
