import { Link } from "react-router-dom";
import { Container, Group, Text, Title } from "@mantine/core";
import { Illustration } from "../custom/Illustration";
import classes from "../css/NothingFoundBackground.module.css";
import { Button } from "@/components/ui/button";

export default function NothingFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />

        <div className={classes.content}>
          <Title className={classes.title}>Nothing to see here</Title>

          <Text c="dimmed" size="lg" className={classes.description}>
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error, contact support.
          </Text>

          <Group justify="center" mt="md">
            <Link to="/home">
              <Button >Take me back to home page</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  );
}
