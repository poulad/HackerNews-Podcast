import {Container, Link, Typography} from "@material-ui/core";

function Dashboard() {
  return <Container maxWidth="lg">
    <Typography variant="h3" component="h3" align="center">
      Moderators Dashboard
    </Typography>
    <ul>
      <li><Link href="podcasts/new">Create a new podcast</Link></li>
    </ul>
  </Container>

}

export default Dashboard