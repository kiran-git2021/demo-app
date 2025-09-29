import { Link } from "react-router-dom";
import { Container, Group, Text, Title } from "@mantine/core";
import { Illustration } from "../custom/Illustration";
import classes from "../css/DevelopmentMessageBackground.module.css";
import { Button } from "@/components/ui/button";

export default function DevelopmentMessage() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />

        <div className={classes.content}>
          <Title className={classes.title}>Feature is Not Ready...</Title>

          <Text c="dimmed" size="lg" className={classes.description}>
            Page you are trying to open does not exist. It might be under development , please contact support.
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
