import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube
} from "@tabler/icons-react";
import { ActionIcon, Anchor, Group } from "@mantine/core";
import classes from "../css/FooterCentered.module.css";
import { Link } from "react-router-dom";

const links = [
  { path: "/#", label: "© 2025 IoTFlow. All rights reserved. " },
  { path: "/privacy", label: "| Privacy Policy |" },
  { path: "/terms", label: " Terms of Service " },
];

export default function FooterCentered() {
  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <Group className={classes.links} spacing="xs" position="center">
          {links.map((link) => (
            <Link key={link.label} to={link.path} className={classes.linkItem}>
              <Anchor c="dimmed" size="sm" lh={1}>
                {link.label}
              </Anchor>
            </Link>
          ))}
        </Group>
      </div>
    </div>
  );
}
