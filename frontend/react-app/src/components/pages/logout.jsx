import {Link} from "react-router-dom";
import { Container, Group, Text, Title} from "@mantine/core";
import { Button } from "@/components/ui/button";
import classes from "@/components/css/DevelopmentMessageBackground.module.css";
import {Illustration} from "@/components/custom/Illustration.jsx";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Logout() {
    const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token"); // clear token
    navigate("/logout"); // redirect to login
  }, [navigate]);

  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        {/*<Illustration className={classes.image} />*/}
        <div className={classes.content}>
          <Title className={classes.title}>User has logged out </Title>
          <Text c="dimmed" size="lg" className={classes.description}>
          </Text>
          <Group justify="center" mt="md">
            <Link to="/login">
              <Button >click to login again</Button>
            </Link>
          </Group>
        </div>
      </div>
    </Container>
  )
}
